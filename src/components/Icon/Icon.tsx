import { assign } from 'lodash-es';

interface IIconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  icon: string;
  size?: number | string;
  svgStyle?: React.CSSProperties;
}

const Icon: React.FC<Readonly<IIconProps>> = (props) => {
  const { icon, color, size = 18, svgStyle = {}, style = {}, ...rest } = props;

  const mergeStyle = assign(
    {
      color: 'inherit',
      width: '1em',
      height: '1em',
      fill: 'currentColor'
    },
    style,
    {
      fontSize: typeof size === 'number' ? `${size}px` : size,
      color
    }
  );

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
