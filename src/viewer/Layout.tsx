import { useEffect, useRef, useState } from 'react';

import type { MenuProps } from 'antd';
import { Dropdown, FloatButton, Input, Space } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

import classnames from 'classnames';

import type { IOutletRef } from '@/router';
import { Link, Outlet, useHistory, useScrollStore } from '@/router';

import { useAppStore } from '@/store';

import {
  error,
  fallbackFullscreen,
  isFullScreen,
  onFullScreen,
  requestFullScreen,
  sleep
} from '@/utils';

import type { FilePanelFactory } from '@/filehandle';
import { isSupportOPFS } from '@/filehandle/utils/checkSupport';

import { Icon } from '@/components';

import LogoImage from '@/assets/images/main.webp';

import { Feedback } from './components/Feedback';
import languageData from './data/language.json';
import navbarData from './data/navbar.json';
import styles from './styles/Layout.module.less';

const Logo = () => {
  return (
    <Link to="/" title="logo">
      <img className={styles.logo} src={LogoImage} alt="logo" />

      <h1 className={styles.title}>{import.meta.env.VITE_APP_TITLE}</h1>
    </Link>
  );
};

// TODO: add serach
const SearchWrap = (props: { onFocus: () => void; onBlur: () => void }) => {
  return (
    <>
      <div className={styles.searchWrap}>
        <Input
          autoComplete="off"
          spellCheck={false}
          title="搜索网站内容"
          variant="filled"
          suffix={<Icon icon="material-symbols:search-rounded" size={20} />}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        />
      </div>
    </>
  );
};

/** navbar component in top */
const TopNavbar = () => {
  const [extend, setExtend] = useState(false);

  const topNavbar = classnames(styles.topNavbar, {
    [styles.extendSearch]: extend
  });

  const handleExtend = () => {
    setExtend(true);
  };
  const handleShrink = () => {
    setExtend(false);
  };

  return (
    <nav className={topNavbar}>
      <ul>
        {navbarData.map((item) => (
          <li key={item.path}>
            <Link to={item.path} activeClass={styles.active} title={item.label}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <SearchWrap onFocus={handleExtend} onBlur={handleShrink} />
    </nav>
  );
};

/** navbar component in side */
const SideNavbar = (props: { visible: boolean; onClick: () => void }) => {
  const sideContainerActiveClass = classnames(styles.sideContainer, {
    [styles.active]: props.visible
  });
  const maskActiveClass = classnames(styles.mask, {
    [styles.active]: props.visible
  });

  return (
    <>
      <div className={sideContainerActiveClass}>
        <div className={styles.sideHeader}>
          <Icon
            className={styles.close}
            icon="material-symbols:close"
            size={25}
            onClick={props.onClick}
          />

          <Logo />
        </div>

        <nav className={styles.sideNavbar}>
          <ul>
            {navbarData.map((item) => (
              <li key={item.path} onClick={props.onClick}>
                <Link to={item.path} activeClass={styles.active} title={item.label}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={maskActiveClass} onClick={props.onClick} />
    </>
  );
};

/** Action button group */
const Actions = () => {
  const {
    settings: { language },
    setLanguage,
    setColorScheme
  } = useAppStore();

  const [fullScreen, setFullScreen] = useState(isFullScreen());

  const history = useHistory();

  useEffect(() => {
    return onFullScreen((val) => {
      setFullScreen(val);
    });
  }, []);

  const handleLanuageChange: MenuProps['onClick'] = (e) => {
    setLanguage(e.key);
  };

  const handleLight = () => {
    setColorScheme('light');
  };
  const handleDark = () => {
    setColorScheme('dark');
  };

  const handleToSettings = () => {
    history.push('/profile');
  };

  const toggerFullScreen = () => {
    if (!fullScreen) {
      return requestFullScreen().then(() => {
        setFullScreen(true);
      });
    }

    fallbackFullscreen().then(() => {
      setFullScreen(false);
    });
  };

  return (
    <div className={styles.actions}>
      <>
        <Icon
          className={classnames(styles.action, styles.light, 'icon-btn')}
          title="切换浅色模式"
          icon="material-symbols:light-mode"
          size={20}
          onClick={handleLight}
        />
        <Icon
          className={classnames(styles.action, styles.dark, 'icon-btn')}
          title="切换深色模式"
          icon="material-symbols:nightlight-rounded"
          size={20}
          onClick={handleDark}
        />
      </>

      <>
        <Icon
          className={classnames(styles.action, styles.fullscreen, 'icon-btn')}
          title="进入全屏模式"
          style={{ display: fullScreen ? 'none' : 'initial' }}
          icon="material-symbols:fullscreen-rounded"
          size={20}
          onClick={toggerFullScreen}
        />
        <Icon
          className={classnames(styles.action, styles.exitFullscreen, 'icon-btn')}
          title="退出全屏模式"
          style={{ display: fullScreen ? 'initial' : 'none' }}
          icon="material-symbols:fullscreen-exit-rounded"
          size={20}
          onClick={toggerFullScreen}
        />
      </>

      <Dropdown
        arrow
        menu={{
          items: languageData,
          selectable: true,
          defaultSelectedKeys: [language],
          onClick: handleLanuageChange
        }}
      >
        <span>
          <Space>
            <Icon
              title="切换显示语言"
              className={classnames(styles.action, 'icon-btn')}
              icon="material-symbols:language-sharp"
              size={20}
            />
          </Space>
        </span>
      </Dropdown>

      <Icon
        className={classnames(styles.action, styles.settings, 'icon-btn')}
        title="进入设置页"
        icon="material-symbols:settings"
        size={20}
        onClick={handleToSettings}
      />
    </div>
  );
};

const Header = () => {
  const [visibleSideNavbar, setVisibleSideNavbar] = useState(false);

  const handleSwitch = () => {
    setVisibleSideNavbar(true);
  };
  const handleClose = () => {
    setVisibleSideNavbar(false);
  };

  return (
    <header className={styles.header}>
      <Icon
        className={styles.drawer}
        icon="material-symbols:dehaze-rounded"
        size={25}
        onClick={handleSwitch}
      />

      <Logo />

      <TopNavbar />

      <SideNavbar visible={visibleSideNavbar} onClick={handleClose} />

      <Actions />
    </header>
  );
};

/** file system trigger, when browser support file system show in */
const FileSystemTrigger = () => {
  const [support, setSupport] = useState(false);
  const filePanelRef = useRef<FilePanelFactory>();

  useEffect(() => {
    isSupportOPFS().then((res) => {
      setSupport(res);
    });
  }, []);

  const handleOpenFilePanel = () => {
    if (!filePanelRef.current) {
      return import('@/filehandle')
        .then(({ default: filePanel }) => {
          filePanelRef.current = filePanel;

          // await render mounted
          sleep(0, () => filePanelRef.current?.toggle());
        })
        .catch((err) => {
          error((err as Error).message);
        });
    }

    filePanelRef.current?.toggle();
  };

  return support ? (
    <FloatButton
      aria-label="filesystem"
      icon={<Icon icon="octicon--file-directory-open-fill-16" color="var(--color-primary)" />}
      onClick={handleOpenFilePanel}
    />
  ) : null;
};

const Content = () => {
  const outletMountedRef = useRef<IOutletRef>(null);
  const mainRef = useRef<HTMLElement>(null);

  const [visibleFeedback, setVisibleFeedback] = useState(false);

  const getSavedPosition = useScrollStore(`.${styles.main}`);

  useEffect(() => {
    outletMountedRef.current?.onMounted(() => {
      const { y } = getSavedPosition();
      mainRef.current?.scrollTo(0, y);
    });
  }, []);

  const handleFeedback = () => {
    setVisibleFeedback(true);
  };

  return (
    <main ref={mainRef} className={styles.main}>
      <Outlet ref={outletMountedRef} />

      <FloatButton.Group>
        <FileSystemTrigger />

        <FloatButton aria-label="feedback" icon={<CommentOutlined />} onClick={handleFeedback} />

        <FloatButton.BackTop
          aria-label="backtop"
          visibilityHeight={2000}
          target={() => mainRef.current!}
        />
      </FloatButton.Group>

      <Feedback visible={visibleFeedback} onChange={(value) => setVisibleFeedback(!!value)} />
    </main>
  );
};

const ViewerLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <Content />
    </div>
  );
};

export default ViewerLayout;
