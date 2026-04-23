import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, Upload, X, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockCategories } from "@/lib/mock-data"
import type { Sweet } from "@/lib/types/api"

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Sweet | null;
}

export function ProductDialog({ open, onClose, product }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    weight: 0,
    currency: "INR",
    quantity: 0,
    lowStockThreshold: 0,
    categories: [] as string[],
    images: [] as string[]
  })
  const [categoriesPopoverOpen, setCategoriesPopoverOpen] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        weight: product.weight,
        currency: product.currency,
        quantity: 0,
        lowStockThreshold: 0,
        categories: product.categories.map(c => typeof c === 'string' ? c : c._id),
        images: product.images || []
      })
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        weight: 0,
        currency: "INR",
        quantity: 0,
        lowStockThreshold: 0,
        categories: [],
        images: []
      })
    }
  }, [product, open])

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => {
      if (prev.categories.includes(categoryId)) {
        return { ...prev, categories: prev.categories.filter((id) => id !== categoryId) }
      }
      return { ...prev, categories: [...prev.categories, categoryId] }
    })
    setCategoriesPopoverOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>Sweet details</DialogTitle>
          <DialogDescription>
            Static mode only. Sweet creation and editing are disabled.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
            Product editing was removed with the API layer. The fields below are read-only.
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} readOnly className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formData.description} readOnly className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={formData.price} readOnly className="w-full" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (g)</Label>
              <Input id="weight" type="number" value={formData.weight} readOnly className="w-full" />
            </div>

            {!product && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" value={formData.quantity} readOnly className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input id="lowStockThreshold" type="number" value={formData.lowStockThreshold} readOnly className="w-full" />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Categories</Label>
              <Popover open={categoriesPopoverOpen} onOpenChange={setCategoriesPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    {formData.categories.length > 0
                      ? `${formData.categories.length} categories selected`
                      : "Select categories..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup>
                        {mockCategories.map((cat) => (
                          <CommandItem
                            key={cat._id}
                            value={cat.name}
                            onSelect={() => handleCategoryToggle(cat._id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.categories.includes(cat._id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {cat.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.categories.map(catId => {
                  const cat = mockCategories.find(c => c._id === catId)
                  return cat ? <Badge key={catId} variant="secondary">{cat.name}</Badge> : null
                })}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="rounded-md border-2 border-dashed p-8 transition-colors flex flex-col items-center justify-center space-y-2 bg-muted/5">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Drag & drop or click to upload images</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload controls are disabled in static mode</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled
                  />
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.images.map((imageId) => (
                    <Badge key={imageId} variant="secondary" className="flex items-center gap-2 py-1.5 px-3 pr-2">
                      <span className="text-[11px] font-mono font-medium">...{imageId.slice(-6)}</span>
                      <div className="flex items-center border-l border-muted-foreground/30 gap-1.5 pl-1.5 ml-1 text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" />
                        <X className="h-3.5 w-3.5" />
                      </div>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6 border-t gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose}>Close</Button>
            <Button type="button" disabled className="min-w-30">
              {product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}