import { PageHeader } from "@/components/page-header"
import { CategoriesTable } from "@/components/categories-table"

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Categories" }
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
            <p className="text-muted-foreground">Manage your product categories.</p>
          </div>
          <CategoriesTable />
        </div>
      </div>
    </>
  )
}
