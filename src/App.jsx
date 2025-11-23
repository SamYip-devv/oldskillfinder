import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import CourseBrowser, { sampleCourses } from './components/CourseBrowser'
import CampusMap from './components/CampusMap'
import Library from './components/Library'
import DuoMobile from './components/DuoMobile'
import LUChatbot from './components/LUChatbot'
import { MapPin, BookOpen } from 'lucide-react'

function App() {
  const [showDuoMobile, setShowDuoMobile] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [showCampusMap, setShowCampusMap] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

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

  const handleReturnHome = () => {
    setShowCampusMap(false)
    setShowLibrary(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header onReturnHome={handleReturnHome} />
      
      <div className="flex flex-1">
        {/* Left Sidebar - Course Categories */}
        <aside className="w-64 bg-white border-r border-gray-300 min-h-[calc(100vh-120px)]">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">Course Categories</h2>
            <nav className="space-y-1">
              <button
                onClick={handleReturnHome}
                className="w-full text-left block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded"
              >
                All Courses
              </button>
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
                <button
                  onClick={handleReturnHome}
                  className="w-full text-left block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded"
                >
                  Enrolled Courses
                </button>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                  Completed
                </a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded">
                  Wishlist
                </a>
              </nav>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">Campus</h2>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setShowCampusMap(!showCampusMap)
                    setShowLibrary(false)
                  }}
                  className={`w-full text-left block px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                    showCampusMap
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Campus Map</span>
                </button>
                <button
                  onClick={() => {
                    setShowLibrary(!showLibrary)
                    setShowCampusMap(false)
                  }}
                  className={`w-full text-left block px-3 py-2 text-sm rounded flex items-center space-x-2 ${
                    showLibrary
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Library</span>
                </button>
              </nav>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-6">
          {showCampusMap ? (
            <CampusMap courses={sampleCourses} />
          ) : showLibrary ? (
            <Library />
          ) : (
            <CourseBrowser />
          )}
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