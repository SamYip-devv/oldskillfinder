import React from 'react'
import { BookOpen, Home, User } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white border-b-2 border-moodle-blue sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-moodle-blue p-2 rounded">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-moodle-blue-dark">SkillFinder</h1>
              <p className="text-xs text-gray-600">Career Discovery Platform</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <a href="#" className="text-gray-700 hover:text-moodle-blue flex items-center space-x-1 text-sm">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <a href="#" className="text-gray-700 hover:text-moodle-blue flex items-center space-x-1 text-sm">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </a>
          </nav>
        </div>
        
        {/* Breadcrumb */}
        <div className="border-t border-gray-200 py-2">
          <nav className="text-sm text-gray-600">
            <a href="#" className="hover:text-moodle-blue">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Career Discovery</span>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 