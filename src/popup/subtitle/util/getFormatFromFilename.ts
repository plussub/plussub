import {SubtitleFormat} from "@/subtitle/state/types";

export const getFormatFromFilename = (filename: string): SubtitleFormat => {
  switch (true) {
    case /\.(ass)$/.test(filename):
      return '.ass';
    case /\.(ssa)$/.test(filename):
      return '.ssa';
    case /\.(vtt)$/.test(filename):
      return '.vtt';
    case /\.(srt)$/.test(filename):
      return '.srt';
    default:
      throw new Error('Not supported: ' + filename)
  }
}
