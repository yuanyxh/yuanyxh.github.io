import type { ImageProps } from 'antd';
import { Image as InnerImage } from 'antd';

import classNames from 'classnames';

import fallbackImage from '@/assets/images/fallback.png';

import styles from './Image.module.less';

interface IImageProps extends ImageProps {}

const Image: React.FC<Readonly<IImageProps>> = (props) => {
  const mergeProps: ImageProps = {
    loading: 'lazy',
    preview: false,
    fallback: fallbackImage,
    placeholder: true,
    ...props,
    rootClassName: classNames(props.className, styles.image)
  };

  return <InnerImage {...mergeProps} />;
};

export default Image;
