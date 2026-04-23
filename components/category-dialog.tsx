import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/types/api"
import { BadgeAlert } from "lucide-react"

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryDialog({ open, onClose, category }: CategoryDialogProps) {
  const [name, setName] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    if (category) {
      setName(category.name)
      setImage(category.image || "")
    } else {
      setName("")
      setImage("")
    }
  }, [category, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>Category details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl border bg-muted/20 p-3 text-sm text-muted-foreground">
            <BadgeAlert className="h-4 w-4 text-amber-600" />
            Category editing is disabled in static mode.
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} readOnly className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Category image</Label>
            <Input id="image" value={image || "No image attached"} readOnly className="w-full" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
