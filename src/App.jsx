import React from 'react'
import Header from './components/Header'
import CourseBrowser from './components/CourseBrowser'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex flex-1">
        {/* Left Sidebar - Course Categories */}
        <aside className="w-64 bg-white border-r border-gray-300 min-h-[calc(100vh-120px)]">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">Course Categories</h2>
            <nav className="space-y-1">
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                All Courses
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Computer Science
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Business & Management
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Arts & Humanities
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Science & Engineering
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Social Sciences
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Languages
              </a>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">My Learning</h2>
              <nav className="space-y-1">
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                  Enrolled Courses
                </a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                  Completed
                </a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                  Wishlist
                </a>
              </nav>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-6">
          <CourseBrowser />
        </main>
      </div>
    </div>
  )
}

export default App 