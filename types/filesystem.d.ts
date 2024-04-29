// Supplementary information about FileSystem types.
// Note that some of these contents are not widely supported, and some have not yet become specifications.

declare type FileSystemHandlePermissionDescriptor = {
  mode: 'read' | 'readwrite';
};

declare type FileSystemHandleCreateOptions = {
  create: boolean;
};

declare type FileSystemHandleRecursiveOptions = {
  recursive: boolean;
};

declare type FileSystemHandleKeepExistingDataOptions = {
  keepExistingData: boolean;
};

declare interface FileSystemSyncOptions {
  at: number;
}

declare interface FileSystemSyncAccessHandle {
  close(): undefined;
  flush(): undefined;
  getSize(): Promise<number>;
  read(buffer: ArrayBuffer, options?: FileSystemSyncOptions): number;
  truncate(newSize: number): undefined;
  write(buffer: ArrayBuffer, options?: FileSystemSyncOptions): number;
}

declare interface FileSystemHandle {
  readonly kind: 'file' | 'directory';
  readonly name: string;
  isSameEntry(arg: FileSystemHandle): boolean;
  queryPermission(
    arg: FileSystemHandlePermissionDescriptor
  ): Promise<PermissionStatus>;
  requestPermission(
    arg: FileSystemHandlePermissionDescriptor
  ): Promise<PermissionStatus>;
  /** @deprecated non-standard */
  remove(options?: FileSystemHandleRecursiveOptions): Promise<undefined>;
}

declare interface FileSystemDirectoryHandle extends FileSystemHandle {
  readonly kind: 'directory';
  entries(): AsyncIterableIterator<
    [string, FileSystemDirectoryHandle | FileSystemFileHandle]
  >;
  keys(): AsyncIterableIterator<string>;
  values(): AsyncIterableIterator<
    FileSystemDirectoryHandle | FileSystemFileHandle
  >;
  getDirectoryHandle(
    name: string,
    options?: FileSystemHandleCreateOptions
  ): Promise<FileSystemDirectoryHandle>;
  getFileHandle(
    name: string,
    options?: FileSystemHandleCreateOptions
  ): Promise<FileSystemFileHandle>;
  removeEntry(
    name: string,
    options?: FileSystemHandleRecursiveOptions
  ): Promise<undefined>;
  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
}

declare interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file';
  createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>;
  createWritable(
    options?: FileSystemHandleKeepExistingDataOptions
  ): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
}

declare enum PublicDirectory {
  'desktop',
  'documents',
  'downloads',
  'music',
  'pictures',
  'videos'
}

declare interface DirectoryPickerOptions {
  id?: string;
  mode?: 'read' | 'readwrite';
  startIn?: FileSystemHandle | PublicDirectory;
}

declare interface TypeDiscription {
  description: string;
  accept: { [key: string]: string[] };
}

declare interface FilePickerOptions {
  multiple?: boolean;
  excludeAcceptAllOption?: boolean;
  types?: TypeDiscription[];
}

declare interface SaveFilePickerOptions {
  excludeAcceptAllOption?: boolean;
  suggestedName?: string;
  types?: TypeDiscription[];
}

declare interface Window {
  showDirectoryPicker: (
    options?: DirectoryPickerOptions
  ) => Promise<FileSystemDirectoryHandle>;
  showOpenFilePicker(
    options?: FilePickerOptions
  ): Promise<FileSystemFileHandle[]>;
  showSaveFilePicker(
    options?: SaveFilePickerOptions
  ): Promise<FileSystemFileHandle>;
}
