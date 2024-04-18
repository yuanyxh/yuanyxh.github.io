import Outlet from './Outlet';
import type Router from '../router';
import { RouterContext } from '../shared/context';

interface IRouterProviderProps {
  router: Router;
}

// inject the context and render the first-level node
const RouterProvider: React.FC<Readonly<IRouterProviderProps>> = (props) => {
  return (
    <RouterContext.Provider value={props.router}>
      <Outlet />
    </RouterContext.Provider>
  );
};

export default RouterProvider;
