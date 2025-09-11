import { Grid3X3 } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-72 bg-gray-100 p-6">
      {/* Logo */}
      <div className="mb-8">
         <div className="flex items-center">
          <img src="/logo.png" alt="Ragir" className="h-8 mr-2" />
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <div className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-lg">
          <Grid3X3 className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </div>
      </nav>
    </div>
  )
}
