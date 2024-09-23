import { createElement, useId, useMemo } from 'react';

import { Anchor, Divider, Image as AntdImage } from 'antd';
import type { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';

import { Link, useLocation } from '@/router';

import { copy } from '@/utils';

import { Icon, Image as InnerImage } from '@/components';

import styles from './styles/Provider.module.less';
import '@/assets/styles/prism-one-dark.css';

import type { MDXComponents } from 'mdx/types';

interface Toc {
  depth: number;
  value: string;
  attributes: Attributes;
  children: Toc[];
}

interface Attributes {
  id?: string;
}

interface ImageProps
  extends Omit<
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src' | 'width' | 'height'
  > {
  url: string;
  width?: number;
  height?: number;
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <article className={styles.article}>{children}</article>;
};

const SubTitle = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> & {
    tag: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  }
) => {
  const { tag, children, ...rest } = props;

  const handleCopyAnchor = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    // TODO: global event show the mesage to user
    copy(new URL(`${window.location.origin}${window.location.pathname}/#${children}`).href);
  };

  return createElement(
    tag,
    { id: children, ...rest },
    children,
    createElement(
      'a',
      {
        href: `${window.location.pathname}#${children}`,
        'aria-hidden': true,
        onClick: handleCopyAnchor
      },
      '#'
    )
  );
};

const Toc = ({ toc }: { toc: Toc[] }) => {
  const location = useLocation();

  // generate two -layer menu
  const anchors = useMemo(() => {
    function map(item: Toc) {
      const result: AnchorLinkItemProps = {
        key: Math.random().toString(16) + item.value,
        href: `${location.path}#${item.value}`,
        title: item.value
      };

      return result;
    }

    return toc.map(function (item) {
      const result = map(item);
      if (item.children?.length) {
        result.children = item.children.map(map);
      }
      return result;
    });
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <aside className={styles.toc}>
        <Anchor
          replace
          targetOffset={0}
          offsetTop={60}
          getContainer={() => window.document.querySelector('main')!}
          items={anchors}
        />
      </aside>
    </div>
  );
};

const calcArticleWrapperSize = () => {
  let containerWidth = 916;

  switch (true) {
    case window.innerWidth <= 768:
      containerWidth = window.innerWidth - 40;
      break;
    case window.innerWidth <= 1366:
      containerWidth = 768;
      break;
    default:
      break;
  }

  return { containerWidth };
};

/** Calculate the image size under the current container size */
function calcImageSize({
  width,
  height,
  containerWidth
}: {
  width: number;
  height: number;
  containerWidth: number;
}) {
  containerWidth = containerWidth > 648 ? 648 : containerWidth;

  if ([width, height, containerWidth].includes(0)) {
    return { width: 0, height: 0 };
  }

  if (width > containerWidth) {
    width = containerWidth;
    height *= containerWidth / width;
  }

  return { width, height };
}

const Image = (props: ImageProps) => {
  const { url, width = 0, height = 0, ...rest } = props;

  // TIPS: use static width values, don't use dynamic values
  const { containerWidth } = calcArticleWrapperSize();

  return (
    // @ts-expect-error img in here
    <InnerImage
      className={styles.image}
      src={url}
      preview={true}
      {...calcImageSize({
        width,
        height,
        containerWidth
      })}
      {...rest}
    />
  );
};

export const useMDXComponents = (): MDXComponents => {
  return {
    wrapper(props) {
      return (
        <Wrapper>
          <AntdImage.PreviewGroup>{props.children}</AntdImage.PreviewGroup>
        </Wrapper>
      );
    },
    Header(props: { frontmatter: { title: string } }) {
      return (
        <header>
          <h1>{props.frontmatter.title}</h1>
        </header>
      );
    },
    Image(props: ImageProps) {
      return <Image {...props} />;
    },
    Toc(props) {
      return <Toc {...props} />;
    },
    h2(props) {
      return <SubTitle tag="h2" {...props} />;
    },
    h3(props) {
      return <SubTitle tag="h3" {...props} />;
    },
    h4(props) {
      return <SubTitle tag="h4" {...props} />;
    },
    h5(props) {
      return <SubTitle tag="h5" {...props} />;
    },
    h6(props) {
      return <SubTitle tag="h6" {...props} />;
    },
    a(props) {
      const { href = '', ...rest } = props;

      let _href = href;
      let rel: string | undefined = 'external nofollow noopener';
      if (['./', '../'].some((path) => href.startsWith(path))) {
        _href = '/articles/' + href.split('/').pop()!.replace('.mdx', '.html');

        rel = void 0;
      }

      return <Link to={_href} rel={rel} {...rest}></Link>;
    },
    code(props) {
      const { className, children, ...rest } = props;

      if (!className) {
        return (
          <code className={styles.inline} {...rest}>
            {children}
          </code>
        );
      }

      const id = useId();

      const handleCopyCode = () => {
        const codeEl = window.document.getElementById(id);

        if (codeEl) {
          // TODO: global event show the mesage to user
          window.navigator.clipboard.writeText(codeEl.innerText);
        }
      };

      return (
        <code id={id} className={className} {...rest}>
          {children}
          <span className={styles.copy} onClick={handleCopyCode}>
            <Icon icon="ph:clipboard" size={20} />
          </span>
        </code>
      );
    },
    hr() {
      return <Divider />;
    }
  };
};
