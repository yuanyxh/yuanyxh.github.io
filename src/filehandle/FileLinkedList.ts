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

const UPDATE_KEY = 'update';

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

    this.event.emit(UPDATE_KEY, val.value);
  }

  listener(fn: (directory: DH) => any) {
    return this.event.on(UPDATE_KEY, fn);
  }

  inset(handle: DH) {
    if (this.current.next && handle.name === this.current.next.value.name) {
      this.current = this.current.next;
    } else {
      this.current = new Node(handle, this.current, null);
    }
  }

  unlink(handle: DH) {
    const { next } = this.current;

    if (next && next.value === handle) {
      this.current.next = null;

      this.event.emit(UPDATE_KEY, this.current.value);
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
