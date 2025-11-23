import React, { useState } from 'react'
import Header from './components/Header'
import StepWizard from './components/StepWizard'
import ResultsView from './components/ResultsView'
import PathwayChoice from './components/PathwayChoice'
import QuickAssessment from './components/QuickAssessment'
import AICareerAdvisor from './components/AICareerAdvisor'
import LoadingAnimation from './components/LoadingAnimation'
import { analyzeQuickAssessment } from './services/quickAnalysis'
import { Sparkles } from 'lucide-react'

function App() {
  const [recommendations, setRecommendations] = useState(null)
  const [pathway, setPathway] = useState(null) // null, 'deep', or 'quick'
  const [key, setKey] = useState(0) // Key to force StepWizard remount
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAIAdvisor, setShowAIAdvisor] = useState(false)

  const handleReset = () => {
    setRecommendations(null)
    setPathway(null)
    setShowAIAdvisor(false)
    setKey(prev => prev + 1)
  }

  const handleQuickAssessmentComplete = async (answers) => {
    setIsAnalyzing(true)
    try {
      const analysis = await analyzeQuickAssessment(answers)
      setRecommendations(analysis)
    } catch (error) {
      console.error('Quick assessment analysis failed:', error)
      alert('Failed to analyze assessment. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex flex-1">
        {/* Left Sidebar - Moodle style */}
        <aside className="w-64 bg-white border-r border-gray-300 min-h-[calc(100vh-120px)]">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">Navigation</h2>
            <nav className="space-y-1">
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Dashboard
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Personality Tests
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Career Recommendations
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Learning Paths
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                Settings
              </a>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase mb-3">Quick Links</h2>
              <nav className="space-y-1">
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                  Help & Support
                </a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-moodle-blue-light hover:text-moodle-blue rounded">
                  About
                </a>
              </nav>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-6">
          <div className="max-w-5xl">
          {/* Pathway Choice - Show first */}
          {!pathway && !recommendations && (
            <PathwayChoice onChoosePathway={setPathway} />
          )}

          {/* Hero Section - Only show after choosing deep pathway */}
          {pathway === 'deep' && !recommendations && (
            <div className="moodle-block mb-6">
              <div className="moodle-block-header">
                <h1 className="text-2xl font-bold text-moodle-blue-dark">Build Your Skill Stack</h1>
              </div>
              <div className="moodle-block-content">
                <p className="text-gray-700">
                  Upload your personality tests and discover skills that complement your undergraduate degree. Build a unique skillset that sets you apart.
                </p>
              </div>
            </div>
          )}

          {/* Step Wizard for deep analysis */}
          {pathway === 'deep' && !recommendations && (
            <StepWizard 
              key={key}
              onRecommendations={(recs) => {
                setRecommendations(recs)
              }}
              onReset={handleReset}
            />
          )}

          {/* Quick Assessment */}
          {pathway === 'quick' && !recommendations && !isAnalyzing && (
            <QuickAssessment 
              onComplete={handleQuickAssessmentComplete}
              onBack={handleReset}
            />
          )}

          {/* Loading Animation */}
          {isAnalyzing && (
            <LoadingAnimation 
              message="Analyzing your responses..."
              stage="analyzing"
            />
          )}

          {/* Recommendations Section */}
          {recommendations && !showAIAdvisor && (
            <ResultsView
              recommendations={recommendations}
              onBack={handleReset}
              onContinueWithAI={() => setShowAIAdvisor(true)}
            />
          )}

          {/* AI Career Advisor */}
          {showAIAdvisor && recommendations && (
            <AICareerAdvisor
              userData={recommendations}
              onBack={() => setShowAIAdvisor(false)}
            />
          )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App 