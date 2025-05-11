import { createRootRoute, Outlet } from '@tanstack/react-router';
import './styles.scss';

export const Route = createRootRoute({
  component: () => (
    <div>
      <Outlet />

      {/* tanstack router 디버깅용 툴 */}
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
});
