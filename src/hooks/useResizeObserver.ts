import type { RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';

interface ISize {
  width: number;
  height: number;
}

const map = new WeakMap<HTMLElement, ResizeObserver | null>();

const sizeMap = new WeakMap<HTMLElement, ISize>();

const defaultSize: ISize = {
  width: 0,
  height: 0
};

/**
 *
 * @description element size change observer
 * @param elRef
 * @returns
 */
export default function useResizeObserver<T extends HTMLElement>(elRef: RefObject<T>) {
  const [size, setSize] = useState(defaultSize);

  useLayoutEffect(() => {
    const ele = elRef.current;

    if (!ele) {
      throw Error('the corresponding element cannot be found.');
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries.pop();

      if (entry) {
        setSize((last) => {
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;

          if (last.width === width && last.height === height) {
            return last;
          }

          const sizeObj = { width: width, height: height };
          sizeMap.set(ele, sizeObj);

          return sizeObj;
        });
      }
    });

    observer.observe(ele);

    map.set(ele, observer);

    return () => {
      map.get(ele)?.unobserve(ele);
      map.delete(ele);
    };
  }, [elRef.current]);

  return size;
}
