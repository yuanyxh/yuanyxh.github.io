import { createElement, useId, useMemo } from 'react';

import { Anchor, Divider } from 'antd';
import type { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';

import { Link, useLocation } from '@/router';

import { copy, error, success } from '@/utils';

import { Icon, Image } from '@/components';

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

    copy(new URL(`${window.location.origin}${window.location.pathname}/#${children}`).href);
    success('Copied!');
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
      '#'.repeat(window.parseInt(tag.slice(1)))
    )
  );
};

function map(item: Toc, base: string) {
  const result: AnchorLinkItemProps = {
    key: Math.random().toString(16) + item.value,
    href: `${base}#${item.value}`,
    title: item.value
  };

  return result;
}
const generateToc = (node: Toc, leave: number, base: string) => {
  const result = map(node, base);
  if (node.children?.length && leave > 0) {
    result.children = node.children.map((child) => generateToc(child, leave - 1, base));
  }
  return result;
};

const Toc = ({ toc }: { toc: Toc[] }) => {
  const location = useLocation();

  // generate three -layer menu
  const anchors = useMemo(() => {
    return toc.map((item) => generateToc(item, 3, location.path));
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

export const useMDXComponents = (): MDXComponents => {
  return {
    wrapper(props) {
      return <Wrapper>{props.children}</Wrapper>;
    },
    Header(props: { frontmatter: { title: string } }) {
      return (
        <header>
          <h1>{props.frontmatter.title}</h1>
        </header>
      );
    },
    img(props) {
      return (
        <Image
          className={styles.image}
          src={props.src}
          preview={{ mask: null }}
          width={props.width}
          height={props.height}
        />
      );
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

      rest.translate = 'no';

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
          window.navigator.clipboard
            .writeText(codeEl.innerText)
            .then(() => {
              success('Copied!');
            })
            .catch(() => {
              error('Copy failed!');
            });
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
