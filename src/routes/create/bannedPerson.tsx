import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create/bannedPerson')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/create/bannedPerson"!</div>
}
