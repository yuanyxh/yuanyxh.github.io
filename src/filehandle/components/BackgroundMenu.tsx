import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import styles from './styles/BackgroundMenu.module.less';
import type { BackgroundProgram } from '../BackgroundManager';
import BackgroundManager from '../BackgroundManager';

interface IBackgroundMenuProps {
  backgroundManager: BackgroundManager;
}

const BackgroundMenu: React.FC<Readonly<IBackgroundMenuProps>> = (props) => {
  const { backgroundManager } = props;

  const [programList, setProgramList] = useState<BackgroundProgram[]>([]);

  const isHidden = programList.length === 0;

  useEffect(() => {
    return backgroundManager.onUpdate((list) => {
      setProgramList(list);
    });
  }, []);

  return createPortal(
    <aside
      className={classNames(styles.backgroundMenu, {
        [styles.hidden]: isHidden
      })}
      aria-hidden={isHidden}
      hidden={isHidden}
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
