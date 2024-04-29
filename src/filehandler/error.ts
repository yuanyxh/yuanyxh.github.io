abstract class FileBaseError extends Error {
  abstract name: string;

  abstract status: number;

  constructor(message?: string) {
    super(message);
  }
}

export class FileAlwaysExistError extends FileBaseError {
  name = 'FileAlwaysExistError';

  status = 410;

  constructor(fileName: string) {
    super(`the file or directory "${fileName}" always exists in this path`);
  }
}

export class FilePathNotExistError extends FileBaseError {
  name = 'FilePathNotExistError';

  status = 411;

  constructor(path: string) {
    super(`this file path "${path}" does not exist`);
  }
}

export class FileNotFoundError extends FileBaseError {
  name = 'FileNotFoundError';

  status = 412;

  constructor(path: string, name: string) {
    super(`"${name}" cannot be found on "${path}"`);
  }
}

export class FileNotDirectoryError extends FileBaseError {
  name = 'FileNotDirectoryError';

  status = 413;

  constructor(path: string) {
    super(`the target "${path}" is not a directory`);
  }
}

export class NotEnoughStorageSpaceError extends FileBaseError {
  name = 'NotEnoughStorageSpaceError';

  status = 414;

  constructor(size: number, space: number) {
    super(
      `insufficient remaining space, this operation is not supported, file size: ${size}byte, remaining size: ${space}. tips: we always reserve 1gb if present`
    );
  }
}
