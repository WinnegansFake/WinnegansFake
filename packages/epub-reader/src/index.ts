/**
 * @winnegans/epub-reader
 * Zero-dependency pure TypeScript library to read, parse, and calibrate pagination for .epub archives.
 */

export { SimpleZip, ZipEntry } from './zip.js';
export { EpubArchive } from './archive.js';
export {
  SequentialSpineMapper,
  CalibratedNumberMapper,
  JoyceanPageMapper,
} from './mappers.js';
export * from './types.js';
