import { assign } from 'lodash-es';

interface IIconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  icon: string;
  size?: number;
  svgStyle?: React.CSSProperties;
}

const Icon: React.FC<Readonly<IIconProps>> = (props) => {
  const { icon, color, size = 18, svgStyle = {}, style = {}, ...rest } = props;

  const mergeStyle = assign({ color: 'inherit', fill: 'currentColor' }, style, {
    fontSize: `${size}px`,
    color
  });

  return (
    <i style={mergeStyle} {...rest}>
      <svg
        style={assign({ width: '1em', height: '1em' }, svgStyle)}
        aria-hidden="true"
      >
        <use xlinkHref={`#icon-${icon.replace(':', '--')}`} />
      </svg>
    </i>
  );
};

export default Icon;
