import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { createElementContainer } from '@/utils';

import FilePanelContainer from './components/FilePanelContainer';

class FilePanelFactory {
  private container = createElementContainer();

  private root = createRoot(this.container);

  private _show: AsyncFunction | undefined;
  private _hide: AsyncFunction | undefined;

  private doorValve = false;

  private isShow = false;

  constructor() {
    const show = (cb?: AsyncFunction) => {
      if (cb) {
        this._show = cb;
      }

      this.show();
    };
    const hide = (cb?: AsyncFunction) => {
      if (cb) {
        this._hide = cb;
      }

      this.hide();
    };

    this.root.render(
      <StrictMode>
        <FilePanelContainer show={show} hide={hide} />
      </StrictMode>
    );
  }

  show() {
    if (this.doorValve) return;
    this.doorValve = true;

    Promise.resolve().then(() => {
      this._show?.().then(() => {
        this.doorValve = false;
        this.isShow = true;
      });
    });
  }

  hide() {
    if (this.doorValve) return;
    this.doorValve = true;

    Promise.resolve().then(() => {
      this._hide?.().then(() => {
        this.doorValve = false;
        this.isShow = false;
      });
    });
  }

  toggle() {
    this.isShow ? this.hide() : this.show();
  }

  destroy() {
    this.root.unmount();
    Promise.resolve().then(() => this.container.remove());
  }
}

export default FilePanelFactory;
