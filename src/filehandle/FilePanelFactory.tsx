import { createRoot } from 'react-dom/client';

import { App } from 'antd';

import FilePanelContainer from './components/FilePanelContainer';

const setStyles = (el: HTMLElement) => {
  el.style.position = 'relative';
  el.style.zIndex = 'var(--z-gighest)';
  el.style.width = '0';
  el.style.height = '0';
};

const getContainer = () => {
  const container = window.document.createElement('div');
  setStyles(container);

  window.document.body.appendChild(container);

  return container;
};

class FilePanelFactory {
  private container = getContainer();

  private root = createRoot(this.container);

  private _show: AsyncFunction | undefined;
  private _hide: AsyncFunction | undefined;

  private doorValve = false;

  private isShow = false;

  constructor() {
    const show = (cb?: AsyncFunction) => {
      if (!this._show && cb) {
        return (this._show = cb);
      }

      this.show();
    };
    const hide = (cb?: AsyncFunction) => {
      if (!this._hide && cb) {
        return (this._hide = cb);
      }

      this.hide();
    };

    this.root.render(
      // antd App provider Modal, Message, Notification
      <App>
        <FilePanelContainer show={show} hide={hide} />
      </App>
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
    // window.document.documentElement.removeEventListener('click', onClick, true);
    this.root.unmount();
    Promise.resolve().then(() => this.container.remove());
  }
}

export default FilePanelFactory;
