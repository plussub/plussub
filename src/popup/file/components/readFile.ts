import chardet from 'chardet';

export interface OnLoadPayload {
  fileName: string;
  result: string;
}

interface Payload {
  file: File;
  onLoad: (payload: OnLoadPayload) => void;
  onError: () => void;
}

export const readFile = ({file, onLoad, onError}: Payload): void => {
  const arrayBufferReader = new FileReader();
  arrayBufferReader.readAsArrayBuffer(file);
  arrayBufferReader.onload = async () => {
    const encoding = chardet.detect(new Uint8Array(arrayBufferReader.result as ArrayBuffer));
    const textReader = new FileReader();
    textReader.readAsText(file, encoding ?? 'UTF-8');
    textReader.onload = async () => onLoad({
      fileName: file.name,
      // as string because we use readAsText...
      result: textReader.result as string
    });
    textReader.onerror = onError;
  };
  arrayBufferReader.onerror = onError;
};
