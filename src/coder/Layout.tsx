import { Outlet } from '@/router';

const CoderLayout = () => {
  return (
    <div className="layout">
      <Outlet />
    </div>
  );
};

export default CoderLayout;
