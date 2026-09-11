/**
 * zip.ts
 * Pure TypeScript ZIP parser with no external dependencies using Node.js built-in zlib.
 */

import fs from 'fs/promises';
import zlib from 'zlib';
import { promisify } from 'util';

const inflateRawAsync = promisify(zlib.inflateRaw);

export interface ZipEntry {
  filename: string;
  compressionMethod: number;
  compressedSize: number;
  uncompressedSize: number;
  offset: number;
  dataOffset?: number;
}

export class SimpleZip {
  private buffer: Buffer;
  private entries: Map<string, ZipEntry> = new Map();

  private constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  public static async fromFile(filePath: string): Promise<SimpleZip> {
    const buffer = await fs.readFile(filePath);
    const zip = new SimpleZip(buffer);
    await zip.parseCentralDirectory();
    return zip;
  }

  public static async fromBuffer(buffer: Buffer): Promise<SimpleZip> {
    const zip = new SimpleZip(buffer);
    await zip.parseCentralDirectory();
    return zip;
  }

  public getFileNames(): string[] {
    return Array.from(this.entries.keys());
  }

  public hasFile(filename: string): boolean {
    const normalized = filename.replace(/^\//, '');
    return this.entries.has(normalized);
  }

  public async readEntry(filename: string): Promise<Buffer> {
    const normalized = filename.replace(/^\//, '');
    const entry = this.entries.get(normalized);
    if (!entry) {
      throw new Error(`File "${filename}" not found in zip archive.`);
    }

    // Read local file header to find exact data start
    const localHeaderOffset = entry.offset;
    const sig = this.buffer.readUInt32LE(localHeaderOffset);
    if (sig !== 0x04034b50) {
      throw new Error(`Invalid local header signature 0x${sig.toString(16)} for "${filename}".`);
    }

    const nameLen = this.buffer.readUInt16LE(localHeaderOffset + 26);
    const extraLen = this.buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + nameLen + extraLen;
    const compressedData = this.buffer.subarray(dataStart, dataStart + entry.compressedSize);

    if (entry.compressionMethod === 0) {
      // Stored (no compression)
      return Buffer.from(compressedData);
    } else if (entry.compressionMethod === 8) {
      // Deflated
      return await inflateRawAsync(compressedData);
    } else {
      throw new Error(`Unsupported compression method ${entry.compressionMethod} for "${filename}".`);
    }
  }

  public async readText(filename: string, encoding: BufferEncoding = 'utf-8'): Promise<string> {
    const buf = await this.readEntry(filename);
    return buf.toString(encoding);
  }

  private async parseCentralDirectory(): Promise<void> {
    // Search for End of Central Directory Record (EOCD) signature: 0x06054b50
    // It's located within the last 65KB of the file
    const buf = this.buffer;
    const minEocdSize = 22;
    const maxSearch = Math.min(buf.length, 65535 + minEocdSize);
    let eocdOffset = -1;

    for (let i = buf.length - minEocdSize; i >= buf.length - maxSearch; i--) {
      if (buf.readUInt32LE(i) === 0x06054b50) {
        eocdOffset = i;
        break;
      }
    }

    if (eocdOffset === -1) {
      throw new Error('Could not find End of Central Directory record in ZIP archive.');
    }

    const totalEntries = buf.readUInt16LE(eocdOffset + 10);
    const cdSize = buf.readUInt32LE(eocdOffset + 12);
    const cdOffset = buf.readUInt32LE(eocdOffset + 16);

    let currOffset = cdOffset;
    for (let i = 0; i < totalEntries; i++) {
      if (currOffset + 46 > buf.length) break;
      const sig = buf.readUInt32LE(currOffset);
      if (sig !== 0x02014b50) {
        break;
      }

      const method = buf.readUInt16LE(currOffset + 10);
      const compressedSize = buf.readUInt32LE(currOffset + 20);
      const uncompressedSize = buf.readUInt32LE(currOffset + 24);
      const fileNameLength = buf.readUInt16LE(currOffset + 28);
      const extraFieldLength = buf.readUInt16LE(currOffset + 30);
      const fileCommentLength = buf.readUInt16LE(currOffset + 32);
      const localHeaderOffset = buf.readUInt32LE(currOffset + 42);

      const fileNameBytes = buf.subarray(currOffset + 46, currOffset + 46 + fileNameLength);
      const fileName = fileNameBytes.toString('utf-8').replace(/\\/g, '/');

      this.entries.set(fileName, {
        filename: fileName,
        compressionMethod: method,
        compressedSize,
        uncompressedSize,
        offset: localHeaderOffset,
      });

      currOffset += 46 + fileNameLength + extraFieldLength + fileCommentLength;
    }
  }
}
