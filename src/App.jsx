import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import CourseBrowser from './components/CourseBrowser'
import DuoMobile from './components/DuoMobile'
import LUChatbot from './components/LUChatbot'

function App() {
  const [showDuoMobile, setShowDuoMobile] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    const handleOpenDuoMobile = () => {
      setShowDuoMobile(true)
    }

    const handleOpenChatbot = () => {
      setShowChatbot(true)
    }

    window.addEventListener('openDuoMobile', handleOpenDuoMobile)
    window.addEventListener('openChatbot', handleOpenChatbot)
    
    return () => {
      window.removeEventListener('openDuoMobile', handleOpenDuoMobile)
      window.removeEventListener('openChatbot', handleOpenChatbot)
    }
  }, [])

  const handleDuoVerify = () => {
    console.log('Duo Mobile verification successful')
    // You can add additional logic here after successful verification
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex flex-1">
        {/* Left Sidebar - Course Categories */}
        <aside className="w-64 bg-white border-r border-gray-300 min-h-[calc(100vh-120px)]">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">Course Categories</h2>
            <nav className="space-y-1">
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                All Courses
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                Computer Science
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                Business & Management
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                Arts & Humanities
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                Science & Engineering
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                Social Sciences
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                Languages
              </a>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">My Learning</h2>
              <nav className="space-y-1">
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                  Enrolled Courses
                </a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                  Completed
                </a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
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

      {/* Duo Mobile 2FA Modal */}
      {showDuoMobile && (
        <DuoMobile
          onClose={() => setShowDuoMobile(false)}
          onVerify={handleDuoVerify}
        />
      )}

      {/* LU Chatbot */}
      {showChatbot && (
        <LUChatbot
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  )
}

export default App 