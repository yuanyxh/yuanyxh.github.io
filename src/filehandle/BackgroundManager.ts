import { cloneDeep } from 'lodash-es';

import { EventEmitter } from '@/utils';

export interface BackgroundProgram {
  readonly id: string;
  icon: React.ReactNode;
  open(): void;
}

const UPDATE_EVENT = 'background_update';

class BackgroundManager {
  private _list: BackgroundProgram[] = [];

  private event = new EventEmitter();

  get list() {
    return cloneDeep(this._list);
  }

  bringToBackground(program: BackgroundProgram) {
    if (this._list.some((value) => program.id === value.id)) {
      throw new Error(
        `You have multiple programs with the same process ID in the background. This is not allowed.
        If you assign the background to multiple program panels, please make sure to use different process IDs.
        Otherwise, please put the program in the foreground before performing this operation.`
      );
    }

    this._list.push(cloneDeep(program));

    this.event.emit(UPDATE_EVENT, this.list);
  }

  removeBackground(id: string) {
    this._list = this._list.filter((value) => value.id !== id);

    this.event.emit(UPDATE_EVENT, this.list);
  }

  onUpdate(fn: (bpList: BackgroundProgram[]) => any) {
    return this.event.on(UPDATE_EVENT, fn);
  }
}

export default BackgroundManager;
