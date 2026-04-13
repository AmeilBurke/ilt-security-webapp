import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create-alert')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/create-alert"!</div>
}
