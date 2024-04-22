import { useEffect, useRef } from 'react';

import { Outlet } from '@/router';

import { useAppStore } from '@/store';

const CoderLayout = () => {
  const {
    settings: { colorScheme },
    setColorScheme
  } = useAppStore();

  const colorSchemeRef = useRef(colorScheme);

  useEffect(() => {
    setColorScheme('dark');

    return () => {
      setColorScheme(colorSchemeRef.current);
    };
  }, []);

  return (
    <div className="layout">
      <Outlet />
    </div>
  );
};

export default CoderLayout;
