import { useLayoutEffect, useState } from 'react';

const map: {
  [key: string]: ResizeObserver | null;
} = {};

const sizeMap: { [key: string]: { width: number; height: number } } = {};

export default function useResizeObserver(selector: string) {
  const [size, setSize] = useState(
    sizeMap[selector] || {
      width: 0,
      height: 0
    }
  );

  useLayoutEffect(() => {
    // TODO: use ref?
    const ele = document.querySelector(selector);

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

          return (sizeMap[selector] = {
            width,
            height
          });
        });
      }
    });

    observer.observe(ele);
    map[selector] = observer;

    return () => {
      map[selector]?.unobserve(ele);
      map[selector] = null;
      delete map[selector];
    };
  }, [selector]);

  return size;
}
