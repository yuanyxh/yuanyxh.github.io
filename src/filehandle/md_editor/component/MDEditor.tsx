import React, { useEffect, useMemo, useRef } from 'react';

import { reduce } from './theme-reduce';
import styles from '../styles/MDEditor.module.less';

import { /* commandsCtx */ Editor, rootCtx } from '@milkdown/core';
import { clipboard } from '@milkdown/plugin-clipboard';
import { cursor } from '@milkdown/plugin-cursor';
import { diagram } from '@milkdown/plugin-diagram';
import { emoji } from '@milkdown/plugin-emoji';
import { history } from '@milkdown/plugin-history';
import { indent } from '@milkdown/plugin-indent';
// import { listener, listenerCtx } from '@milkdown/plugin-listener';
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
import {
  /* callCommand, getMarkdown, insert, */ replaceAll
} from '@milkdown/utils';

interface IMDEditorProps {
  markdown?: string;
}

const MDEditor: React.FC<IMDEditorProps> = (props) => {
  const { markdown = '' } = props;

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor>();

  // getMarkdown()(editorRef.current!.ctx)

  useEffect(() => {
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, editorContainerRef.current!);

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
      .use(tooltipFactory('md-editor'))
      .use(slashFactory('md-editor'))
      .create()
      .then((editor) => {
        if (editorRef.current) {
          editorRef.current.destroy(true);
        }
        editorRef.current = editor;

        replaceAll(markdown)(editorRef.current.ctx);
      });

    return () => {
      editorRef.current && editorRef.current.destroy(true);
    };
  }, []);

  useMemo(() => {
    if (editorRef.current) {
      replaceAll(markdown)(editorRef.current.ctx);
    }
  }, [markdown]);

  const handleSave = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.key.toLocaleLowerCase() === 'c') {
      e.preventDefault();
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
