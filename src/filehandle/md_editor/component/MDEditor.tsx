import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import type { FH } from '@/filehandle/utils/fileManager';

import styles from './styles/MDEditor.module.less';
import type { UploadInfo } from '../store/useMDStore';
import { useMDStore } from '../store/useMDStore';
import { toFormData } from '../utils';

import { fromTextArea } from 'hypermd';

interface HandlerAction {
  setPlaceholder<T extends HTMLElement>(placeholder: T): void;
  resize(): void;
  finish(text: string, cursor?: number): void;
}

interface IMDEditorProps {
  currentHandle: FH | null;
  changed: boolean;
  onChanged(changed: boolean): any;
  onSave(markdown: string): any;
}

type Editor = ReturnType<typeof fromTextArea>;

export interface IMDEditorExpose {
  getMarkdown(): string;
}

const isMac = (() => {
  const agent = navigator.userAgent.toLowerCase();
  const _isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
    return false;
  }
  if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
    return false;
  }
  if (_isMac) {
    return true;
  }

  return false;
})();

const createMDImage = (url: string) => `![${Date.now()}](${url})`;

let uploadInfo: UploadInfo | null = null;
const fileHandler = (files: FileList, handler: HandlerAction) => {
  if (!uploadInfo || uploadInfo.url.trim() === '') {
    // TODO: to base64
    return handler.finish(createMDImage(window.URL.createObjectURL(files[0])));
  }

  const body = uploadInfo.body.trim() ? JSON.parse(uploadInfo.body) : {};
  const data = toFormData({ ...body, [uploadInfo.field]: files[0] });

  const navigation = uploadInfo.navigation;

  fetch(uploadInfo.url, {
    method: 'POST',
    body: data
  })
    .then((res) => res.json())
    .then((value) => {
      const url = navigation.split('.').reduce((prev, curr) => prev[curr], value);

      handler.finish(createMDImage(url));
    })
    .catch(() => {
      handler.finish('');
    });

  return true;
};

const MDEditor = forwardRef<IMDEditorExpose, IMDEditorProps>(function MDEditor(props, ref) {
  const { currentHandle, changed, onChanged, onSave } = props;

  const editorContainerRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<Editor>();

  uploadInfo = useMDStore().uploadInfo;

  useImperativeHandle(ref, () => ({
    getMarkdown() {
      return editorRef.current ? editorRef.current.getValue() : '';
    }
  }));

  // FIXME: The content has not changed but the update event is triggered
  const onUpdate = () => {
    onChanged(true);
  };

  useEffect(() => {
    currentHandle
      ?.getFile()
      .then((file) => file.text())
      .then((markdown) => {
        editorRef.current = fromTextArea(editorContainerRef.current!, {
          mode: {
            name: 'hypermd',
            hashtag: false
          },
          hmdFold: {
            image: true,
            link: true,
            math: true,
            html: true,
            emoji: true
          },
          lineNumbers: false,
          gutters: false
        });

        editorRef.current.setValue(markdown);
        editorRef.current.setOption('hmdInsertFile', fileHandler);
        editorRef.current.on('change', onUpdate);
        editorRef.current.on('keydown', handleSave);
      });

    return () => {
      editorRef.current?.off('change', onUpdate);
      editorRef.current?.off('keydown', handleSave);
      editorRef.current?.toTextArea();
    };
  }, [currentHandle, changed]);

  const handleSave = (_cm: Editor, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMac) {
      if (e.metaKey && e.key.toLocaleLowerCase() === 's') {
        e.preventDefault();

        changed && onSave(editorRef.current?.getValue() || '');
      }
    } else {
      if (e.ctrlKey && e.key.toLocaleLowerCase() === 's') {
        e.preventDefault();

        changed && onSave(editorRef.current?.getValue() || '');
      }
    }
  };

  return (
    <textarea
      ref={editorContainerRef}
      id="md-editor"
      style={{ display: 'none' }}
      className={styles.editorContainer}
    ></textarea>
  );
});

export default MDEditor;
