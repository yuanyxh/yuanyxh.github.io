import { EventEmitter } from '@/utils';

import type { DH } from './utils/fileManager';

export class Node {
  value: DH;
  fallback: Node | null;
  next: Node | null;

  constructor(value: DH, fallback: Node | null, next: Node | null) {
    this.value = value;
    this.fallback = fallback;
    this.next = next;
  }
}

class FileLinkedList {
  root: Node;

  _current: Node;

  event = new EventEmitter();

  constructor(root: DH) {
    this.root = new Node(root, null, null);
    this._current = this.root;
  }

  get current() {
    return this._current;
  }

  set current(val) {
    this._current = val;

    this.event.emit('update', val.value);
  }

  listener(fn: (directory: DH) => any) {
    return this.event.on('update', fn);
  }

  inset(handle: DH) {
    // TODO: When I enter Directory A, return to the directory before entering, and delete the A directory A. At this time, abnormal
    if (this.current.next && handle.name === this.current.next.value.name) {
      this.current = this.current.next;
    } else {
      this.current = new Node(handle, this.current, null);
    }
  }

  fallback() {
    if (this.current.fallback) {
      this.current.fallback.next = this.current;
      this.current = this.current.fallback;
    }
  }

  next() {
    if (this.current.next) {
      this.current.next.fallback = this.current;
      this.current = this.current.next;
    }
  }
}

export default FileLinkedList;
