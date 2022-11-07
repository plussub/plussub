import chardet from 'chardet';

interface ReadResult {
  filename: string;
  result: string;
}

export const readFile = async (file: File): Promise<ReadResult> => {
  return new Promise((resolve, reject) => {
    const arrayBufferReader = new FileReader();
    arrayBufferReader.readAsArrayBuffer(file);
    arrayBufferReader.onload = async () => {
      const encoding = chardet.detect(new Uint8Array(arrayBufferReader.result as ArrayBuffer));
      const textReader = new FileReader();
      textReader.readAsText(file, encoding ?? 'UTF-8');
      textReader.onload = () => resolve({
        filename: file.name,
        // as string because we use readAsText...
        result: textReader.result as string
      });
      textReader.onerror = reject;
    };
    arrayBufferReader.onerror = reject;
  });
};
