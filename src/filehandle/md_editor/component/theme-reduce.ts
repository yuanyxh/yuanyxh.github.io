/* Copyright 2021, Milkdown by Mirone. */

import styles from '../styles/MDEditor.module.less';

import { Editor } from '@milkdown/core';
import { editorViewOptionsCtx } from '@milkdown/core';

export function reduce(ctx: Editor['ctx']): void {
  ctx.update(editorViewOptionsCtx, (prev) => {
    const prevClass = prev.attributes;

    return {
      ...prev,
      attributes: (state) => {
        const attrs =
          typeof prevClass === 'function' ? prevClass(state) : prevClass;

        return {
          ...attrs,
          class: styles.themeReduce
        };
      }
    };
  });
}
