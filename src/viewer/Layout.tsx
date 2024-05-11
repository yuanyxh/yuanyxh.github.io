import { useEffect, useRef, useState } from 'react';

import type { MenuProps } from 'antd';
import {
  Button,
  Dropdown,
  FloatButton,
  Form,
  Input,
  Modal,
  Select,
  Space
} from 'antd';
import { CommentOutlined } from '@ant-design/icons';

import classnames from 'classnames';
import classNames from 'classnames';
import { AuthType, createClient } from 'webdav';

import type { IOutletRef } from '@/router';
import { Link, Outlet, useHistory, useScrollStore } from '@/router';

import { useAppStore } from '@/store';

import {
  error,
  fallbackFullscreen,
  isFullScreen,
  onFullScreen,
  requestFullScreen,
  sleep,
  success
} from '@/utils';

import type { FilePanelFactory } from '@/filehandle';
import { isSupportOPFS } from '@/filehandle/utils/checkSupport';

import { Icon } from '@/components';

import LogoImage from '@/assets/images/main.webp';

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
                <Link
                  to={item.path}
                  activeClass={styles.active}
                  title={item.label}
                >
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
      <Icon
        className={`${styles.action} ${styles.light}`}
        title="切换浅色模式"
        icon="material-symbols:light-mode"
        size={20}
        onClick={handleLight}
      />
      <Icon
        className={`${styles.action} ${styles.dark}`}
        title="切换深色模式"
        icon="material-symbols:nightlight-rounded"
        size={20}
        onClick={handleDark}
      />

      <Icon
        className={`${styles.action} ${styles.fullscreen}`}
        title="进入全屏模式"
        style={{ display: fullScreen ? 'none' : 'initial' }}
        icon="material-symbols:fullscreen-rounded"
        size={20}
        onClick={toggerFullScreen}
      />
      <Icon
        className={`${styles.action} ${styles.exitFullscreen}`}
        title="退出全屏模式"
        style={{ display: fullScreen ? 'initial' : 'none' }}
        icon="material-symbols:fullscreen-exit-rounded"
        size={20}
        onClick={toggerFullScreen}
      />

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
              className={styles.action}
              icon="material-symbols:language-sharp"
              size={20}
            />
          </Space>
        </span>
      </Dropdown>

      <Icon
        className={classNames(styles.action, styles.settings)}
        title="进入设置页"
        icon="material-symbols:settings"
        size={20}
        onClick={handleToSettings}
      />
    </div>
  );
};

const Header = () => {
  const [visible, setVisible] = useState(false);

  const handleSwitch = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
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

      <SideNavbar visible={visible} onClick={handleClose} />

      <Actions />
    </header>
  );
};

interface IFeedbackProps {
  visible: boolean;
  onChange: (visible?: boolean) => void;
}

const initialValues = {
  concact: '',
  type: 'suggestion',
  description: ''
};
const Feedback: React.FC<IFeedbackProps> = ({ visible, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const [form] = Form.useForm();

  const onTypeChange = (type: string) => {
    form.setFieldValue('type', type);
  };

  const handleUploadFeedback = async () => {
    try {
      setUploading(true);

      // TODO: change to real host
      const client = createClient('http://localhost:3000/api', {
        authType: AuthType.Digest
      });

      const issuse = '/issues';
      const json =
        new Date().toLocaleDateString('zh-CN').replace(/\//g, '-') + '.json';
      const fullPath = issuse + '/' + json;

      if (!(await client.exists(issuse))) {
        await client.createDirectory(issuse);
      }

      let list: { type: string; concact: string; description: string }[] = [];

      if (await client.exists(fullPath)) {
        const oldJSON = (await client.getFileContents(fullPath, {
          format: 'text'
        })) as string;

        list = JSON.parse(oldJSON);
      }

      list.push(form.getFieldsValue());

      await client.putFileContents(fullPath, JSON.stringify(list, null, 2), {
        overwrite: true
      });

      form.resetFields();

      success('已添加反馈建议。');
    } catch (err) {
      error('抱歉，暂时无法添加反馈，请稍后再试或前往 Github 留言。');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Modal
        style={{ top: '15vh' }}
        title="反馈建议"
        open={visible}
        footer={null}
        onCancel={() => onChange(false)}
      >
        <Form
          style={{ maxWidth: 600, marginTop: 30 }}
          name="feedback"
          form={form}
          initialValues={initialValues}
          layout="vertical"
          onFinish={handleUploadFeedback}
        >
          <Form.Item name="concact" label="联系方式">
            <Input
              placeholder="请输入您的联系方式，并备注使用的客户端"
              maxLength={40}
              showCount
            />
          </Form.Item>

          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'suggestion', label: '建议' },
                { value: 'feedback', label: '反馈' }
              ]}
              onChange={onTypeChange}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入清晰的描述信息' }]}
          >
            <Input.TextArea
              style={{ resize: 'none' }}
              rows={5}
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={uploading}>
                提交
              </Button>

              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

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
      icon={
        <Icon
          icon="octicon--file-directory-open-fill-16"
          color="var(--color-primary)"
        />
      }
      onClick={handleOpenFilePanel}
    />
  ) : null;
};

const Content = () => {
  const mountedRef = useRef<IOutletRef>(null);
  const mainRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);

  const getSavedPosition = useScrollStore(`.${styles.main}`);

  useEffect(() => {
    mountedRef.current?.onMounted(() => {
      const { y } = getSavedPosition();
      mainRef.current?.scrollTo(0, y);
    });
  }, []);

  const handleFeedback = () => {
    setVisible(true);
  };

  return (
    <main ref={mainRef} className={styles.main}>
      <Outlet ref={mountedRef} />

      <FloatButton.Group>
        <FileSystemTrigger />

        <FloatButton
          aria-label="feedback"
          icon={<CommentOutlined />}
          onClick={handleFeedback}
        />

        {/* FIXME: antd internal error, using outdated findDOMNode api causes react to throw warning in strict mode */}
        <FloatButton.BackTop
          aria-label="backtop"
          visibilityHeight={2000}
          target={() => mainRef.current!}
        />
      </FloatButton.Group>

      <Feedback visible={visible} onChange={(value) => setVisible(!!value)} />
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
