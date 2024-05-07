import { cloneDeep } from 'lodash-es';

interface BackgroundProgram {
  readonly id: string;
  icon: React.ReactNode;
}

class BackgroundManager {
  private _list: BackgroundProgram[] = [];

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
  }

  bringToForeground(id: string) {
    this._list = this._list.filter((value) => value.id !== id);
  }
}

export default BackgroundManager;
