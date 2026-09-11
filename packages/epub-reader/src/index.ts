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
  UlyssesEpisodeMapper,
  RegexPaginationMapper,
  CustomOffsetMapper,
  registerMapper,
  getMapperForWork,
  type RegexPaginationMapperOptions,
  type CustomOffsetMapperOptions,
} from './mappers.js';
export * from './types.js';

