abstract class FileBaseError extends Error {
  abstract name: string;

  abstract status: number;

  constructor(message?: string) {
    super(message);
  }
}

export class FileTypeError extends FileBaseError {
  name = 'FileTypeError';

  status = 410;

  constructor(fileName: string) {
    super(
      `This file or directory "${fileName}" type is abnormal and cannot support subsequent operations.`
    );
  }
}

export class FilePathNotExistsError extends FileBaseError {
  name = 'FileTypeError';

  status = 411;

  constructor(filePath: string) {
    super(`This file path "${filePath}" does not exist.`);
  }
}
