import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import './styles.scss';

export const Route = createRootRoute({
  component: () => (
    <div>
      <Outlet />

      <TanStackRouterDevtools />
    </div>
  ),
});
