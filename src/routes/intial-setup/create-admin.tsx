import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/intial-setup/create-admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/intial-setup/create-admin"!</div>
}
