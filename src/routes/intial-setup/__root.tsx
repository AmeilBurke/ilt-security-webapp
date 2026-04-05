import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/intial-setup/__root')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/intial-setup/__root"!</div>
}
