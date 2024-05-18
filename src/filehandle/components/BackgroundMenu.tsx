import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import styles from './styles/BackgroundMenu.module.less';
import type {
  BackgroundManager,
  BackgroundProgram
} from '../BackgroundManager';

interface IBackgroundMenuProps {
  backgroundManager: BackgroundManager;
}

const BackgroundMenu: React.FC<Readonly<IBackgroundMenuProps>> = (props) => {
  const { backgroundManager } = props;

  const [programList, setProgramList] = useState<BackgroundProgram[]>([]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    backgroundManager.subscribeVisible(setIsVisible);

    const cacheListenerUpdate = backgroundManager.onUpdate((list) =>
      setProgramList(list)
    );

    return () => {
      cacheListenerUpdate();
    };
  }, []);

  return createPortal(
    <aside
      className={classNames(styles.backgroundMenu, {
        [styles.hidden]: !isVisible
      })}
      aria-hidden={!isVisible}
      hidden={!isVisible}
    >
      {programList.map((program) => (
        <span
          key={program.id}
          className={styles.program}
          onClick={program.open}
        >
          {program.icon}
        </span>
      ))}
    </aside>,
    window.document.body
  );
};

export default BackgroundMenu;
