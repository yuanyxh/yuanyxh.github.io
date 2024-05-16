import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';

import type { FH } from '@/filehandle/utils/fileManager';

import styles from './styles/MDEditor.module.less';
import '@/assets/styles/prism-one-dark.css';
import { reduce } from '../theme-reduce';

import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { clipboard } from '@milkdown/plugin-clipboard';
import { diagram } from '@milkdown/plugin-diagram';
import { history } from '@milkdown/plugin-history';
import { indent } from '@milkdown/plugin-indent';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { prism, prismConfig } from '@milkdown/plugin-prism';
import { upload } from '@milkdown/plugin-upload';
import {
  blockquoteAttr,
  bulletListAttr,
  codeBlockAttr,
  commonmark,
  emphasisAttr,
  headingAttr,
  hrAttr,
  imageAttr,
  inlineCodeAttr,
  insertImageCommand,
  insertImageInputRule,
  linkAttr,
  orderedListAttr,
  paragraphAttr
} from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { getMarkdown } from '@milkdown/utils';

interface IMDEditorProps {
  currentHandle: FH | null;
  changed: boolean;
  onChanged(changed: boolean): any;
  onSave(markdown: string): any;
}

export interface IMDEditorExpose {
  getMarkdown(): string;
}

const blockElementKeys = [
  blockquoteAttr.key,
  bulletListAttr.key,
  orderedListAttr.key,
  headingAttr.key,
  hrAttr.key,
  imageAttr.key,
  paragraphAttr.key
];

const blockClass = { class: styles.typography };

const getMDString = getMarkdown();

function createMDEditor(
  el: HTMLElement,
  value = '',
  onUpdate: (md: string) => void
) {
  return Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, el);
      ctx.set(defaultValueCtx, value);

      ctx.set(prismConfig.key, {
        configureRefractor: (r) => {
          r.alias('shell', 'sh');
        }
      });

      blockElementKeys.forEach((key) => ctx.set(key, () => blockClass));

      ctx.set(inlineCodeAttr.key, () => ({ class: styles.inlineCode }));
      ctx.set(linkAttr.key, () => ({ rel: 'noopener noreferrer' }));
      ctx.set(codeBlockAttr.key, () => ({ pre: blockClass, code: {} }));
      ctx.set(emphasisAttr.key, () => blockClass);

      ctx.get(listenerCtx).markdownUpdated((_ctx, md) => onUpdate(md));
    })
    .config(reduce)
    .use(commonmark)
    .use(prism)
    .use(insertImageInputRule)
    .use(insertImageCommand)
    .use(gfm)
    .use(history)
    .use(diagram)
    .use(clipboard)
    .use(indent)
    .use(upload)
    .use(listener)
    .create();
}

const MDEditor = forwardRef<IMDEditorExpose, IMDEditorProps>(
  function MDEditor(props, ref) {
    const { currentHandle, changed, onChanged, onSave } = props;

    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Editor>();
    const mdStringRef = useRef('');

    const creatingRef = useRef(false);

    useImperativeHandle(ref, () => ({
      getMarkdown() {
        return editorRef.current ? getMDString(editorRef.current.ctx) : '';
      }
    }));

    useMemo(() => {
      if (creatingRef.current) {
        return void 0;
      }

      if (editorRef.current) {
        editorRef.current.destroy(true);
      }

      if (currentHandle) {
        creatingRef.current = true;

        currentHandle
          .getFile()
          .then((file) => file.text())
          .then((markdown) => {
            createMDEditor(editorContainerRef.current!, markdown, onUpdate)
              .then((value) => {
                editorRef.current = value;
                mdStringRef.current = markdown;
                onChanged(false);
              })
              .finally(() => {
                creatingRef.current = false;
              });
          });
      }

      return () => {
        editorRef.current?.destroy(true);
      };
    }, [currentHandle]);

    function onUpdate(md: string) {
      onChanged(true);
      mdStringRef.current = md;
    }

    const handleSave = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.ctrlKey && e.key.toLocaleLowerCase() === 's') {
        e.preventDefault();

        changed && onSave(mdStringRef.current);
      }
    };

    return (
      <div
        ref={editorContainerRef}
        id="md-editor"
        className={styles.editorContainer}
        onKeyDown={handleSave}
      ></div>
    );
  }
);

export default MDEditor;
