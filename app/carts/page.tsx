import { PageHeader } from "@/components/page-header"
import { CartsTable } from "@/components/carts-table"

export default function CartsPage() {
  return (
    <>
      <PageHeader
        title="Carts"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Carts" }
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Active Carts</h2>
            <p className="text-muted-foreground">View and manage customer shopping carts.</p>
          </div>
          <CartsTable />
        </div>
      </div>
    </>
  )
}
