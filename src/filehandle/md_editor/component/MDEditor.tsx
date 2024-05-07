import { useMemo, useRef, useState } from 'react';

import styles from './styles/MDEditor.module.less';
import { reduce } from './theme-reduce';

import {
  /* commandsCtx */ defaultValueCtx,
  Editor,
  rootCtx
} from '@milkdown/core';
import { clipboard } from '@milkdown/plugin-clipboard';
import { cursor } from '@milkdown/plugin-cursor';
import { diagram } from '@milkdown/plugin-diagram';
import { emoji } from '@milkdown/plugin-emoji';
import { history } from '@milkdown/plugin-history';
import { indent } from '@milkdown/plugin-indent';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { slashFactory } from '@milkdown/plugin-slash';
import { tooltipFactory } from '@milkdown/plugin-tooltip';
import { upload } from '@milkdown/plugin-upload';
import {
  blockquoteAttr,
  commonmark,
  emphasisAttr,
  headingAttr,
  hrAttr,
  imageAttr,
  inlineCodeAttr,
  insertImageCommand,
  insertImageInputRule,
  linkAttr,
  paragraphAttr
} from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { /* callCommand, */ getMarkdown /* insert */ } from '@milkdown/utils';

interface IMDEditorProps {
  markdown?: string;
  onSave(markdown: string): any;
}

function createMDEditor(
  el: HTMLElement,
  value = '',
  onUpdate: (md: string) => void
) {
  return Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, el);
      ctx.set(defaultValueCtx, value);

      ctx.set(inlineCodeAttr.key, () => ({ class: styles.inlineCode }));
      ctx.set(blockquoteAttr.key, () => ({ class: styles.typography }));
      // ctx.set(codeBlockAttr.key, () => ({
      //   class: styles.typography
      // }));
      ctx.set(emphasisAttr.key, () => ({ class: styles.typography }));
      ctx.set(headingAttr.key, () => ({ class: styles.typography }));
      ctx.set(hrAttr.key, () => ({ class: styles.typography }));
      ctx.set(imageAttr.key, () => ({ class: styles.typography }));
      ctx.set(paragraphAttr.key, () => ({ class: styles.typography }));
      ctx.set(linkAttr.key, () => ({ rel: 'noopener noreferrer' }));

      ctx.get(listenerCtx).markdownUpdated((_ctx, md) => {
        onUpdate(md);
      });
    })
    .config(reduce)
    .use(commonmark)
    .use(insertImageInputRule)
    .use(insertImageCommand)
    .use(gfm)
    .use(history)
    .use(cursor)
    .use(diagram)
    .use(clipboard)
    .use(emoji)
    .use(indent)
    .use(upload)
    .use(listener)
    .use(tooltipFactory('md-editor'))
    .use(slashFactory('md-editor'))
    .create();
}

const getMDString = getMarkdown();

const MDEditor: React.FC<IMDEditorProps> = (props) => {
  const { markdown = '', onSave } = props;

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor>();
  const mdStringRef = useRef('');

  const [changed, setChanged] = useState(false);

  useMemo(() => {
    (async () => {
      if (editorRef.current) {
        await editorRef.current.destroy(true);
      }

      setChanged(false);
      createMDEditor(editorContainerRef.current!, markdown, onUpdate).then(
        (value) => {
          editorRef.current = value;
          mdStringRef.current = markdown;
        }
      );
    })();
  }, [markdown]);

  function onUpdate(md: string) {
    setChanged(true);
    mdStringRef.current = md;
  }

  const handleSave = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.key.toLocaleLowerCase() === 'c') {
      e.preventDefault();

      changed && onSave(getMDString(editorRef.current!.ctx));
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
};

export default MDEditor;
