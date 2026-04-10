import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/initial-setup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
