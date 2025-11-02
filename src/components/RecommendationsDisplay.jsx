import React from 'react'
import { Briefcase, TrendingUp, Award, BookOpen, Target, Users, Lightbulb } from 'lucide-react'

const RecommendationCard = ({ icon: Icon, title, items, color }) => (
  <div className="card p-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className={`bg-gradient-to-r ${color} p-3 rounded-xl`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">{item.name}</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
          {item.match && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Match Score</span>
                <span>{item.match}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${color}`}
                  style={{ width: `${item.match}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)

const RecommendationsDisplay = ({ recommendations, uploadedTests }) => {
  if (!recommendations) return null

  const uploadedTestNames = Object.entries(uploadedTests)
    .filter(([key, value]) => value !== null)
    .map(([key]) => {
      const names = {
        big5: 'Big 5 Personality',
        multipleIntelligence: 'Multiple Intelligence',
        riasec: 'RIASEC',
        cliftonStrengths: 'CliftonStrengths'
      }
      return names[key]
    })

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-primary-500 mr-2" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Your Personalized Recommendations
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Based on your {uploadedTestNames.join(', ')} results
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-2xl mx-auto">
          <p className="text-blue-700 text-sm">
            ✨ These recommendations are AI-generated based on your personality test results. 
            Use them as a starting point for exploring your career options.
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Career Paths */}
        <RecommendationCard
          icon={Briefcase}
          title="Recommended Career Paths"
          color="from-blue-500 to-blue-600"
          items={recommendations.careerPaths || []}
        />
        
        {/* ILP Event Recommendations */}
        <RecommendationCard
          icon={BookOpen}
          title="CityU ILP Events for You"
          color="from-purple-500 to-purple-600"
          items={recommendations.ilpEvents || []}
        />

        {/* Skills to Develop */}
        <RecommendationCard
          icon={TrendingUp}
          title="Skills to Develop"
          color="from-green-500 to-green-600"
          items={recommendations.skills || []}
        />
        
        {/* Educational Paths */}
        <RecommendationCard
          icon={BookOpen}
          title="Educational Recommendations"
          color="from-indigo-500 to-indigo-600"
          items={recommendations.education || []}
        />

        {/* Work Environment */}
        <RecommendationCard
          icon={Users}
          title="Ideal Work Environment"
          color="from-orange-500 to-orange-600"
          items={recommendations.workEnvironment || []}
        />
      </div>

      {/* Key Insights */}
      {recommendations.insights && (
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 rounded-xl">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Key Insights</h3>
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">{recommendations.insights}</p>
          </div>
        </div>
      )}

      {/* Next Steps */}
      {recommendations.nextSteps && (
        <div className="card p-6 mt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Recommended Next Steps</h3>
          </div>
          <div className="space-y-3">
            {recommendations.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-emerald-100 text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecommendationsDisplay 