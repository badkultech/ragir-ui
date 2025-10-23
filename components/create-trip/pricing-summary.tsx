import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PricingSummary() {
  return (
    <Card className="h-full bg-gray-50">
      <CardHeader>
        <CardTitle className="text-base ">Pricing Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Accommodation:</span>
          <span>₹0</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Transport:</span>
          <span>₹0</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Meals:</span>
          <span>₹0</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Activities:</span>
          <span>₹0</span>
        </div>
        <hr className="my-2" />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Sub Total:</span>
          <span>₹0</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Discount:</span>
          <span>₹0</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Taxes (18% GST):</span>
          <span>₹0</span>
        </div>
        <hr className="my-2" />
        <div className="flex items-center justify-between font-medium">
          <span>Total per Person:</span>
          <span>₹0</span>
        </div>
      </CardContent>
    </Card>
  )
}
