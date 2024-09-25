type IFileDataType = 'text' | 'dataurl' | 'binrary';

/**
 *
 * @description read file
 * @param file
 * @param type
 */
export function readFile(file: File, type: 'text'): Promise<string>;
export function readFile(file: File, type: 'dataurl'): Promise<string>;
export function readFile(file: File, type: 'binrary'): Promise<ArrayBuffer>;
export function readFile(file: File, type: IFileDataType = 'binrary') {
  const reader = new FileReader();

  let resovle!: (result: string | ArrayBuffer) => any;
  let reject!: (err: Error) => any;
  const p = new Promise<string | ArrayBuffer>((_resolve, _reject) => {
    resovle = _resolve;
    reject = _reject;
  });

  reader.onload = () => {
    if (reader.result) {
      resovle(reader.result);
    } else {
      reject(new Error('Empty data exception, File data is Null.'));
    }
  };

  reader.onerror = () => {
    reject(new Error(reader.error?.message));
  };

  switch (type) {
    case 'text':
      reader.readAsText(file);

      break;
    case 'dataurl':
      reader.readAsDataURL(file);

      break;
    case 'binrary':
      reader.readAsArrayBuffer(file);

      break;
    default:
      reject(new Error('Unsupported type value, please pass one of text, dataurl, binrary.'));
      break;
  }

  return p;
}
