import { useEffect, useRef, useState } from 'react';

import { addGlobalListener, sleep } from '@/utils';

import styles from './ContextMenu.module.less';

export interface SubMenu
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: string;
}

export interface Menu
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: string;
  // subMenu?: SubMenu[];
  icon?: React.ReactNode;
}

export interface IContextMenuProps {
  menu: Menu[];
  getBindElement(): HTMLElement;
  getContainer(): HTMLElement;
  onHide?(): any;
}

function resetOffset(el: HTMLElement) {
  el.style.top = 'initial';
  el.style.right = 'initial';
  el.style.bottom = 'initial';
  el.style.left = 'initial';
}
function setOffset({
  el,
  container,
  x,
  y
}: {
  el: HTMLElement;
  container: HTMLElement;
  x: number;
  y: number;
}) {
  resetOffset(el);

  // TIPS: We need to render it to get the real width and height
  el.style.display = 'block';
  el.style.visibility = 'hidden';
  const { width, height } = el.getBoundingClientRect();
  el.style.display = 'none';
  el.style.visibility = 'initial';

  const { x: cX, y: cY } = container.getBoundingClientRect();
  const { clientWidth, clientHeight } = window.document.documentElement;

  el.style.left = (clientWidth - x > width ? x - cX : x - cX - width) + 'px';
  el.style.top = (clientHeight - y > height ? y - cY : y - cY - height) + 'px';
}

const ContextMenu: React.FC<Readonly<IContextMenuProps>> = (props) => {
  const { menu, getBindElement, getContainer, onHide } = props;

  const [showMenu, setShowMenu] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const bindElement = getBindElement();

    function onContextMenu(e: MouseEvent) {
      e.preventDefault();

      const el = sectionRef.current!;

      setOffset({ el, container: getContainer(), x: e.pageX, y: e.pageY });

      setShowMenu(true);
    }
    bindElement.addEventListener('contextmenu', onContextMenu);

    const cancelGlobalListener = addGlobalListener('mousedown', () => {
      setShowMenu(false);

      onHide && onHide();
    });

    return () => {
      bindElement.removeEventListener('contextmenu', onContextMenu);
      cancelGlobalListener();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.contextMenu}
      style={{ display: showMenu ? 'block' : 'none' }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {menu.map((item) => {
        const { name, icon, onClick, ...rest } = item;

        return (
          <span
            className={styles.item}
            key={name}
            title={name}
            onClick={(e) => {
              onClick?.(e);
              sleep(35, () => setShowMenu(false));
            }}
            {...rest}
          >
            <span className={styles.icon}>{icon}</span>
            {name}
          </span>
        );
      })}
    </section>
  );
};

export default ContextMenu;
