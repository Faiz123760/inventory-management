import { PageHeader } from "@/components/page-header"
import { InventoryTable } from "@/components/inventory-table"

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Inventory"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Inventory" }
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
            <p className="text-muted-foreground">Manage your product inventory and stock levels.</p>
          </div>
          <InventoryTable />
        </div>
      </div>
    </>
  )
}
