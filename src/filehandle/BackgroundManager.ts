import { cloneDeep } from 'lodash-es';

import { EventEmitter } from '@/utils';

import router from '@/routes';

import filePanel from '.';

export interface BackgroundProgram {
  readonly id: string;
  icon: React.ReactNode;
  open(): void;
}

const UPDATE_EVENT = 'background_update';

/** Background application manager */
export class BackgroundManager {
  private _list: BackgroundProgram[] = [];

  private event = new EventEmitter();

  private toggleShowMenu: ((show: boolean) => any) | undefined;

  constructor() {
    // TIPS: We want the file system not to be displayed when entering the /coder page
    router.subscribe(({ path }) => {
      if (path.startsWith('/coder')) {
        this.toggleShowMenu?.(false);
        filePanel.hide();
      } else if (this._list.length !== 0) {
        this.toggleShowMenu?.(true);
      }
    });
  }

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

    this.toggleShowMenu?.(true);
  }

  removeBackground(id: string) {
    this._list = this._list.filter((value) => value.id !== id);

    this.event.emit(UPDATE_EVENT, this.list);

    if (this._list.length === 0) {
      this.toggleShowMenu?.(false);
    }
  }

  subscribeVisible(cb: (show: boolean) => any) {
    this.toggleShowMenu = cb;
  }

  onUpdate(fn: (bpList: BackgroundProgram[]) => any) {
    return this.event.on(UPDATE_EVENT, fn);
  }
}

export default new BackgroundManager();
