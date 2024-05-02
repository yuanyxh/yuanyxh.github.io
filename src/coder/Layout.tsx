import { useEffect, useRef } from 'react';

import { Outlet } from '@/router';

import { useAppStore } from '@/store';

const CoderLayout = () => {
  const {
    settings: { colorScheme },
    setColorSchemeNonPersistent
  } = useAppStore();

  const colorSchemeRef = useRef(colorScheme);

  useEffect(() => {
    setColorSchemeNonPersistent('dark');

    return () => {
      setColorSchemeNonPersistent(colorSchemeRef.current);
    };
  }, []);

  return (
    <div className="layout">
      <Outlet />
    </div>
  );
};

export default CoderLayout;
