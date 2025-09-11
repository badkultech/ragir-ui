import Image from "next/image"
import { Bell } from "lucide-react"

export function AppHeader() {
  return (
     <header className="w-full bg-white shadow-sm flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <img src="/logo.png" alt="Ragir" className="h-8 mr-2" />
        </div>
        <div className="flex items-center space-x-4">
        {/* Notification Icon */}
          <div className="relative">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.405-3.405A2.032 2.032 0 0118 12.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v1.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden">
            <img 
              src="/user-avatar.png" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzIgMzJDMzIgMjYuNDc3MSAyNy41MjI5IDIyIDIyIDIySDhDMTIuNDc3MSAyMiA4IDI2LjQ3NzEgOCAzMlYzMkgzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==";
              }}
            />
          </div>
        </div>
      </header>
  )
}
