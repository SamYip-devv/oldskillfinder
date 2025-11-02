import React, { useState } from 'react'
import { ChevronRight, ChevronLeft, User, GraduationCap, Briefcase, Heart, Brain, Target, Sparkles, Clock, ArrowRight } from 'lucide-react'

const QuickAssessment = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    // Basic Info
    undergraduateDegree: '',
    majorSatisfaction: 3,
    includeMajor: true,
    aboutYourself: '',
    
    // Quick personality questions
    workStyle: null,
    problemSolving: null,
    socialEnergy: null,
    learningPreference: null,
    workEnvironment: null,
    
    // Interest questions
    freeTime: null,
    excitingProject: null,
    naturalStrength: null,
    avoidActivity: null,
    futureVision: null,
    
    // Values and motivations
    motivation: null,
    stressCoping: null,
    teamRole: null,
    decisionMaking: null,
    workPace: null
  })

  const steps = [
    {
      title: "Basic Information",
      icon: User,
      component: BasicInfoStep
    },
    {
      title: "Work Style",
      icon: Briefcase,
      component: WorkStyleStep
    },
    {
      title: "Interests & Strengths",
      icon: Heart,
      component: InterestsStep
    },
    {
      title: "Values & Motivations",
      icon: Target,
      component: ValuesStep
    }
  ]

  const CurrentStepComponent = steps[currentStep].component
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete the assessment
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const updateAnswer = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }))
  }

  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return (!answers.includeMajor || answers.undergraduateDegree.trim() !== '') && answers.aboutYourself.trim() !== ''
      case 1:
        return answers.workStyle && answers.problemSolving && answers.socialEnergy && 
               answers.learningPreference && answers.workEnvironment
      case 2:
        return answers.freeTime && answers.excitingProject && answers.naturalStrength && 
               answers.avoidActivity && answers.futureVision
      case 3:
        return answers.motivation && answers.stressCoping && answers.teamRole && 
               answers.decisionMaking && answers.workPace
      default:
        return false
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Quick Assessment Progress</h3>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className={`flex items-center ${index <= currentStep ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                index < currentStep ? 'bg-green-600 border-green-600 text-white' :
                index === currentStep ? 'border-green-600 bg-white' :
                'border-gray-300 bg-white'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                index < currentStep ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
        <CurrentStepComponent answers={answers} updateAnswer={updateAnswer} />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl shadow hover:shadow-md transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{currentStep === 0 ? 'Back' : 'Previous'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepComplete()}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
            isStepComplete()
              ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Step 1: Basic Information
const BasicInfoStep = ({ answers, updateAnswer }) => {
  const satisfactionEmojis = ['😟', '😕', '😐', '😊', '😍']
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
        <p className="text-gray-600">This helps us personalize your recommendations</p>
      </div>

      {/* Include Major Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <span className="text-sm font-medium text-gray-700">
          Include my major in skill recommendations?
        </span>
        <button
          type="button"
          onClick={() => updateAnswer('includeMajor', !answers.includeMajor)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            answers.includeMajor ? 'bg-green-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              answers.includeMajor ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Undergraduate Degree */}
      <div className={`transition-opacity ${answers.includeMajor ? 'opacity-100' : 'opacity-40'}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Current Undergraduate Degree
        </label>
        <input
          type="text"
          value={answers.undergraduateDegree}
          onChange={(e) => updateAnswer('undergraduateDegree', e.target.value)}
          placeholder="e.g., Computer Science, Business Administration, Psychology"
          disabled={!answers.includeMajor}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            answers.includeMajor 
              ? 'border-gray-300 bg-white' 
              : 'border-gray-200 bg-gray-50 cursor-not-allowed'
          }`}
        />
      </div>

      {/* Major Satisfaction */}
      <div className={`transition-opacity ${answers.includeMajor ? 'opacity-100' : 'opacity-40'}`}>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          How satisfied are you with your major?
        </label>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min="1"
              max="5"
              value={answers.majorSatisfaction}
              onChange={(e) => updateAnswer('majorSatisfaction', parseInt(e.target.value))}
              disabled={!answers.includeMajor}
              className={`w-full h-2 rounded-lg appearance-none ${
                answers.includeMajor ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              style={{
                background: answers.includeMajor 
                  ? `linear-gradient(to right, 
                    ${answers.majorSatisfaction === 1 ? '#ef4444' : '#e5e7eb'} 0%, 
                    ${answers.majorSatisfaction >= 2 ? '#f59e0b' : '#e5e7eb'} 25%, 
                    ${answers.majorSatisfaction >= 3 ? '#eab308' : '#e5e7eb'} 50%, 
                    ${answers.majorSatisfaction >= 4 ? '#84cc16' : '#e5e7eb'} 75%, 
                    ${answers.majorSatisfaction === 5 ? '#10b981' : '#e5e7eb'} 100%)`
                  : '#e5e7eb'
              }}
            />
          </div>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl">{satisfactionEmojis[answers.majorSatisfaction - 1]}</span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              !answers.includeMajor ? 'bg-gray-100 text-gray-400' :
              answers.majorSatisfaction === 1 ? 'bg-red-100 text-red-700' :
              answers.majorSatisfaction === 2 ? 'bg-orange-100 text-orange-700' :
              answers.majorSatisfaction === 3 ? 'bg-yellow-100 text-yellow-700' :
              answers.majorSatisfaction === 4 ? 'bg-lime-100 text-lime-700' :
              'bg-green-100 text-green-700'
            }`}>
              {answers.majorSatisfaction === 1 && "I really dislike it"}
              {answers.majorSatisfaction === 2 && "Not very happy"}
              {answers.majorSatisfaction === 3 && "It's okay"}
              {answers.majorSatisfaction === 4 && "I like it"}
              {answers.majorSatisfaction === 5 && "I love it!"}
            </span>
          </div>
        </div>
      </div>

      {/* About Yourself */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tell us a bit about yourself
        </label>
        <textarea
          value={answers.aboutYourself}
          onChange={(e) => updateAnswer('aboutYourself', e.target.value)}
          placeholder="What are your interests? What do you enjoy doing? What are your goals? (2-3 sentences)"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  )
}

// Step 2: Work Style Questions
const WorkStyleStep = ({ answers, updateAnswer }) => {
  const questions = [
    {
      id: 'workStyle',
      question: 'How do you prefer to work on projects?',
      options: [
        { value: 'independent', label: 'I love working alone and having full control', trait: 'high autonomy, low agreeableness' },
        { value: 'small-team', label: 'I enjoy collaborating with a small, close team', trait: 'moderate extraversion, high agreeableness' },
        { value: 'large-team', label: 'I thrive in large groups with diverse perspectives', trait: 'high extraversion, high openness' },
        { value: 'flexible', label: 'I adapt based on the project needs', trait: 'high openness, balanced personality' }
      ]
    },
    {
      id: 'problemSolving',
      question: 'When faced with a complex problem, you typically:',
      options: [
        { value: 'analyze', label: 'Break it down systematically and analyze each part', trait: 'high conscientiousness, analytical thinking' },
        { value: 'creative', label: 'Look for creative, out-of-the-box solutions', trait: 'high openness, creative thinking' },
        { value: 'research', label: 'Research what others have done in similar situations', trait: 'investigative, moderate openness' },
        { value: 'intuition', label: 'Trust my gut feeling and jump in', trait: 'low conscientiousness, high risk tolerance' }
      ]
    },
    {
      id: 'socialEnergy',
      question: 'After a long day of meetings and interactions:',
      options: [
        { value: 'energized', label: 'I feel energized and ready for more', trait: 'very high extraversion' },
        { value: 'neutral', label: 'I feel fine, neither drained nor energized', trait: 'moderate extraversion' },
        { value: 'need-break', label: 'I need some quiet time to recharge', trait: 'moderate introversion' },
        { value: 'exhausted', label: 'I feel completely drained and need to be alone', trait: 'high introversion' }
      ]
    },
    {
      id: 'learningPreference',
      question: 'You learn best when:',
      options: [
        { value: 'doing', label: 'Hands-on practice and experimentation', trait: 'kinesthetic learner, practical' },
        { value: 'visual', label: 'Watching demonstrations or visual content', trait: 'visual learner, observant' },
        { value: 'reading', label: 'Reading detailed documentation', trait: 'verbal learner, analytical' },
        { value: 'discussing', label: 'Discussing concepts with others', trait: 'social learner, collaborative' }
      ]
    },
    {
      id: 'workEnvironment',
      question: 'Your ideal work environment is:',
      options: [
        { value: 'structured', label: 'Highly organized with clear processes', trait: 'high conscientiousness, conventional' },
        { value: 'dynamic', label: 'Fast-paced and constantly changing', trait: 'low neuroticism, high openness' },
        { value: 'creative', label: 'Flexible with room for experimentation', trait: 'high openness, artistic' },
        { value: 'supportive', label: 'Collaborative with strong mentorship', trait: 'high agreeableness, social' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Style Preferences</h2>
        <p className="text-gray-600">Help us understand how you like to work</p>
      </div>

      {questions.map((q) => (
        <div key={q.id} className="space-y-3">
          <h3 className="font-medium text-gray-900">{q.question}</h3>
          <div className="space-y-2">
            {q.options.map((option) => (
              <label
                key={option.value}
                className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[q.id] === option.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={option.value}
                  checked={answers[q.id] === option.value}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  className="sr-only"
                />
                <span className="text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Step 3: Interests & Strengths
const InterestsStep = ({ answers, updateAnswer }) => {
  const questions = [
    {
      id: 'freeTime',
      question: 'In your free time, you\'re most likely to:',
      options: [
        { value: 'create', label: 'Work on creative projects (art, music, writing)', trait: 'artistic interests' },
        { value: 'tinker', label: 'Build or fix things with your hands', trait: 'realistic interests' },
        { value: 'analyze', label: 'Solve puzzles or analyze data', trait: 'investigative interests' },
        { value: 'socialize', label: 'Organize events or help others', trait: 'social interests' }
      ]
    },
    {
      id: 'excitingProject',
      question: 'Which type of project excites you most?',
      options: [
        { value: 'innovation', label: 'Creating something completely new', trait: 'entrepreneurial, creative' },
        { value: 'improvement', label: 'Improving existing systems', trait: 'analytical, systematic' },
        { value: 'impact', label: 'Projects that directly help people', trait: 'social, altruistic' },
        { value: 'technical', label: 'Complex technical challenges', trait: 'investigative, analytical' }
      ]
    },
    {
      id: 'naturalStrength',
      question: 'People often come to you for:',
      options: [
        { value: 'ideas', label: 'Creative ideas and brainstorming', trait: 'high creativity, ideation' },
        { value: 'planning', label: 'Organization and planning', trait: 'high conscientiousness, strategic' },
        { value: 'emotional', label: 'Emotional support and advice', trait: 'high emotional intelligence, empathy' },
        { value: 'technical', label: 'Technical expertise and problem-solving', trait: 'analytical, logical thinking' }
      ]
    },
    {
      id: 'avoidActivity',
      question: 'Which activity would you most want to avoid?',
      options: [
        { value: 'repetitive', label: 'Repetitive, routine tasks', trait: 'needs variety, low conventional' },
        { value: 'public', label: 'Public speaking or presentations', trait: 'introverted, low social' },
        { value: 'detail', label: 'Detailed paperwork and documentation', trait: 'big picture thinker, low detail' },
        { value: 'conflict', label: 'Dealing with conflicts or complaints', trait: 'low confrontation, high agreeableness' }
      ]
    },
    {
      id: 'futureVision',
      question: 'In 5 years, you see yourself:',
      options: [
        { value: 'expert', label: 'As a recognized expert in a specific field', trait: 'specialist, deep knowledge' },
        { value: 'leader', label: 'Leading teams and driving strategy', trait: 'leadership, enterprising' },
        { value: 'entrepreneur', label: 'Running my own business or projects', trait: 'entrepreneurial, independent' },
        { value: 'innovator', label: 'Creating innovative solutions to big problems', trait: 'visionary, creative' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interests & Strengths</h2>
        <p className="text-gray-600">Let's explore what naturally interests and energizes you</p>
      </div>

      {questions.map((q) => (
        <div key={q.id} className="space-y-3">
          <h3 className="font-medium text-gray-900">{q.question}</h3>
          <div className="space-y-2">
            {q.options.map((option) => (
              <label
                key={option.value}
                className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[q.id] === option.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={option.value}
                  checked={answers[q.id] === option.value}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  className="sr-only"
                />
                <span className="text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Step 4: Values & Motivations
const ValuesStep = ({ answers, updateAnswer }) => {
  const questions = [
    {
      id: 'motivation',
      question: 'What motivates you most in your work?',
      options: [
        { value: 'impact', label: 'Making a meaningful impact on the world', trait: 'purpose-driven, altruistic' },
        { value: 'growth', label: 'Continuous learning and personal growth', trait: 'growth mindset, curious' },
        { value: 'recognition', label: 'Recognition and career advancement', trait: 'achievement-oriented, ambitious' },
        { value: 'balance', label: 'Work-life balance and flexibility', trait: 'lifestyle-focused, balanced' }
      ]
    },
    {
      id: 'stressCoping',
      question: 'Under pressure, you tend to:',
      options: [
        { value: 'thrive', label: 'Perform at your best', trait: 'low neuroticism, stress-resistant' },
        { value: 'methodical', label: 'Become more focused and methodical', trait: 'high conscientiousness, organized' },
        { value: 'support', label: 'Seek support from others', trait: 'collaborative, team-oriented' },
        { value: 'struggle', label: 'Feel overwhelmed and need to step back', trait: 'high neuroticism, needs low-stress' }
      ]
    },
    {
      id: 'teamRole',
      question: 'In a team setting, you naturally become:',
      options: [
        { value: 'leader', label: 'The leader who sets direction', trait: 'natural leader, decisive' },
        { value: 'mediator', label: 'The mediator who keeps harmony', trait: 'diplomatic, people-focused' },
        { value: 'innovator', label: 'The idea generator', trait: 'creative, visionary' },
        { value: 'executor', label: 'The reliable executor who gets things done', trait: 'dependable, task-focused' }
      ]
    },
    {
      id: 'decisionMaking',
      question: 'When making important decisions, you:',
      options: [
        { value: 'data', label: 'Gather all data and analyze thoroughly', trait: 'analytical, evidence-based' },
        { value: 'intuition', label: 'Trust your intuition and experience', trait: 'intuitive, experienced' },
        { value: 'others', label: 'Consult with others and build consensus', trait: 'collaborative, inclusive' },
        { value: 'quick', label: 'Make quick decisions and adjust as needed', trait: 'decisive, adaptable' }
      ]
    },
    {
      id: 'workPace',
      question: 'Your preferred work pace is:',
      options: [
        { value: 'steady', label: 'Steady and consistent progress', trait: 'methodical, reliable' },
        { value: 'bursts', label: 'Intense bursts of productivity', trait: 'cyclical energy, creative' },
        { value: 'deadline', label: 'Driven by deadlines and urgency', trait: 'deadline-motivated, reactive' },
        { value: 'flexible', label: 'Varies based on interest and energy', trait: 'flexible, adaptable' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Values & Motivations</h2>
        <p className="text-gray-600">Understanding what drives you helps us find the best fit</p>
      </div>

      {questions.map((q) => (
        <div key={q.id} className="space-y-3">
          <h3 className="font-medium text-gray-900">{q.question}</h3>
          <div className="space-y-2">
            {q.options.map((option) => (
              <label
                key={option.value}
                className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[q.id] === option.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={option.value}
                  checked={answers[q.id] === option.value}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  className="sr-only"
                />
                <span className="text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickAssessment