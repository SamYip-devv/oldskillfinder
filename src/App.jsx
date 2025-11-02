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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Pathway Choice - Show first */}
          {!pathway && !recommendations && (
            <PathwayChoice onChoosePathway={setPathway} />
          )}

          {/* Hero Section - Only show after choosing deep pathway */}
          {pathway === 'deep' && !recommendations && (
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary-500 mr-2" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Build Your Skill Stack
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Upload your personality tests and discover skills that complement your undergraduate degree. Build a unique skillset that sets you apart.
              </p>
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
  )
}

export default App 