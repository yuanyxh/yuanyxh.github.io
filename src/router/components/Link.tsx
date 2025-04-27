import { MouseEventHandler, useCallback } from 'react';

import { useLocation } from '@/router';

import { useHistory } from '..';

interface ILinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  replace?: boolean;
  activeClass?: string;
}

const excludeLinks = ['http://', 'https://', '#'];

const comparedRoute = (path: string, to: string) => {
  path = path || '';

  const seps = to.split('/');
  const locations = path.split('/').slice(0, seps.length);

  return seps.every((sep, i) => sep === locations[i]);
};

const Link: React.FC<Readonly<ILinkProps>> = (props) => {
  const { to, target, replace = false, activeClass = '', className = '', onClick, ...rest } = props;

  const history = useHistory();
  const location = useLocation();

  const checkLink = (value: string) => to.startsWith(value);

  const _target =
    target || (!to.startsWith('#') && excludeLinks.some(checkLink)) ? '_blank' : void 0;

  const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      onClick?.(e);

      if (target === '_blank' || excludeLinks.some(checkLink)) {
        if (to.startsWith('#')) {
          history.replace(to, { ...location, hash: to });
        }
        return false;
      }

      e.preventDefault();

      if (replace) {
        history.replace(to, location);
      } else {
        history.push(to, location);
      }
    },
    [props]
  );

  let mergeClassName = className;
  if (activeClass && comparedRoute(location.path, to)) {
    mergeClassName += ` ${activeClass}`;
  }

  return (
    <a href={to} target={_target} className={mergeClassName} onClick={handleClick} {...rest}></a>
  );
};

export default Link;
