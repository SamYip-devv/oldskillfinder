import React from 'react'
import { Compass, User, BookOpen } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-xl">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            SkillFinder
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header 