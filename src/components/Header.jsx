import React from 'react'
import { BookOpen, Home, User, Search, Shield } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white border-b-2 border-moodle-blue sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-orange-700">LUOODLE</h1>
              <p className="text-xs text-gray-600">College Intranet - Course Browser</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <a href="#" className="text-gray-700 hover:text-orange-600 flex items-center space-x-1 text-sm">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-600 flex items-center space-x-1 text-sm">
              <User className="w-4 h-4" />
              <span>My Courses</span>
            </a>
            <button
              onClick={() => {
                const event = new CustomEvent('openDuoMobile')
                window.dispatchEvent(event)
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center space-x-1 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Duo Mobile</span>
            </button>
            <button
              onClick={() => {
                const event = new CustomEvent('openChatbot')
                window.dispatchEvent(event)
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center space-x-1 transition-colors"
            >
              <span>💬</span>
              <span>LU Chatgpt</span>
            </button>
          </nav>
        </div>
        
        {/* Breadcrumb */}
        <div className="border-t border-gray-200 py-2">
          <nav className="text-sm text-gray-600">
            <a href="#" className="hover:text-orange-600">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Course Catalog</span>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 