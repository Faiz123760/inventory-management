import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ImageOff } from "lucide-react"

interface ImageViewDialogProps {
  open: boolean
  onClose: () => void
  imageId?: string | null
}

export function ImageViewDialog({ open, onClose, imageId }: ImageViewDialogProps) {
  if (!imageId) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Image Viewer</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center h-96 space-y-3 text-center">
            <ImageOff className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Image previews are disabled in static mode.</p>
            <p className="text-xs text-muted-foreground">Reference ID: ...{imageId.slice(-12)}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={onClose} size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
