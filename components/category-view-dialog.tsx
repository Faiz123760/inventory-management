import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Category } from "@/lib/types/api"
import { mockSweets } from "@/lib/mock-data"

interface CategoryViewDialogProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryViewDialog({ open, onClose, category }: CategoryViewDialogProps) {
  const categorySweets = mockSweets.filter(sweet => {
    if (!sweet.categories) return false
    return sweet.categories.some(c =>
      (typeof c === 'string' ? c === category?._id : c._id === category?._id)
    )
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Items in Category: {category?.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {categorySweets.length > 0 ? (
            <ul className="list-disc pl-6 space-y-2">
              {categorySweets.map(s => (
                <li key={s._id}>{s.name} - {s.price} {s.currency}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No items found in this category.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
