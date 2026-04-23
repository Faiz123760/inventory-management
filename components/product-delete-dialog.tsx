import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Sweet } from "@/lib/types/api"
import { BadgeAlert } from "lucide-react"

interface ProductDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Sweet | null;
}

export function ProductDeleteDialog({ open, onClose, product }: ProductDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Sweet</DialogTitle>
          <DialogDescription>
            Static mode does not support deleting sweets. "{product?.name}" is shown for reference only.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-xl border bg-muted/20 p-3 text-sm text-muted-foreground">
          <BadgeAlert className="h-4 w-4 text-amber-600" />
          Editing actions were removed with the API layer.
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
