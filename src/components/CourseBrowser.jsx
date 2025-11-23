import React, { useState } from 'react'
import { BookOpen, Clock, Users, Star, ChevronRight, Filter, X, Calendar, Mail, Upload, FileText, Utensils, ShoppingCart } from 'lucide-react'

// Sample course data with additional details
export const sampleCourses = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    instructor: 'Dr. Sarah Chen',
    category: 'Computer Science',
    duration: '8 weeks',
    students: 1250,
    rating: 4.7,
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications.',
    image: '🌐',
    participants: [
      { name: 'Alice Wong', email: 'alice.wong@ln.hk', role: 'Student' },
      { name: 'Bob Chan', email: 'bob.chan@ln.hk', role: 'Student' },
      { name: 'Carol Lee', email: 'carol.lee@ln.hk', role: 'Student' },
      { name: 'David Liu', email: 'david.liu@ln.hk', role: 'Student' },
      { name: 'Eva Zhang', email: 'eva.zhang@ln.hk', role: 'Student' },
      { name: 'Dr. Sarah Chen', email: 'sarah.chen@ln.hk', role: 'Instructor' }
    ],
    timetable: [
      { day: 'Monday', time: '10:00 - 12:00', venue: 'LKK301', venueCode: 'LKK301', type: 'Lecture' },
      { day: 'Wednesday', time: '14:00 - 16:00', venue: 'LKK105', venueCode: 'LKK105', type: 'Lab' },
      { day: 'Friday', time: '10:00 - 11:00', venue: 'LKK301', venueCode: 'LKK301', type: 'Tutorial' }
    ],
    assignments: [
      { id: 1, title: 'HTML/CSS Project', dueDate: '2024-12-15', status: 'pending' },
      { id: 2, title: 'JavaScript Quiz', dueDate: '2024-12-20', status: 'pending' },
      { id: 3, title: 'Final Project', dueDate: '2024-12-30', status: 'pending' }
    ]
  },
  {
    id: 2,
    title: 'Business Strategy and Planning',
    instructor: 'Prof. Michael Johnson',
    category: 'Business & Management',
    duration: '6 weeks',
    students: 890,
    rating: 4.5,
    description: 'Develop strategic thinking skills and learn to create effective business plans.',
    image: '📊',
    participants: [
      { name: 'Frank Tang', email: 'frank.tang@ln.hk', role: 'Student' },
      { name: 'Grace Ho', email: 'grace.ho@ln.hk', role: 'Student' },
      { name: 'Henry Lam', email: 'henry.lam@ln.hk', role: 'Student' },
      { name: 'Iris Ng', email: 'iris.ng@ln.hk', role: 'Student' },
      { name: 'Prof. Michael Johnson', email: 'michael.johnson@ln.hk', role: 'Instructor' }
    ],
    timetable: [
      { day: 'Tuesday', time: '09:00 - 11:00', venue: 'LBY102', venueCode: 'LBY102', type: 'Lecture' },
      { day: 'Thursday', time: '15:00 - 17:00', venue: 'LBY102', venueCode: 'LBY102', type: 'Seminar' }
    ],
    assignments: [
      { id: 1, title: 'Case Study Analysis', dueDate: '2024-12-18', status: 'pending' },
      { id: 2, title: 'Business Plan Presentation', dueDate: '2024-12-25', status: 'pending' }
    ]
  },
  {
    id: 3,
    title: 'Digital Marketing Fundamentals',
    instructor: 'Dr. Emily Rodriguez',
    category: 'Business & Management',
    duration: '4 weeks',
    students: 2100,
    rating: 4.8,
    description: 'Master SEO, social media marketing, and content creation strategies.',
    image: '📱',
    participants: [
      { name: 'Jack Wu', email: 'jack.wu@ln.hk', role: 'Student' },
      { name: 'Kelly Yip', email: 'kelly.yip@ln.hk', role: 'Student' },
      { name: 'Leo Cheung', email: 'leo.cheung@ln.hk', role: 'Student' },
      { name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@ln.hk', role: 'Instructor' }
    ],
    timetable: [
      { day: 'Monday', time: '14:00 - 16:00', venue: 'SEK102', venueCode: 'SEK102', type: 'Lecture' },
      { day: 'Wednesday', time: '14:00 - 16:00', venue: 'SEKG01', venueCode: 'SEKG01', type: 'Workshop' }
    ],
    assignments: [
      { id: 1, title: 'SEO Audit Report', dueDate: '2024-12-12', status: 'pending' },
      { id: 2, title: 'Social Media Campaign', dueDate: '2024-12-22', status: 'pending' }
    ]
  },
  {
    id: 4,
    title: 'Data Science with Python',
    instructor: 'Dr. James Wilson',
    category: 'Computer Science',
    duration: '10 weeks',
    students: 1650,
    rating: 4.9,
    description: 'Learn data analysis, visualization, and machine learning using Python.',
    image: '📈',
    participants: [
      { name: 'Mia Lau', email: 'mia.lau@ln.hk', role: 'Student' },
      { name: 'Noah Tsang', email: 'noah.tsang@ln.hk', role: 'Student' },
      { name: 'Olivia Poon', email: 'olivia.poon@ln.hk', role: 'Student' },
      { name: 'Dr. James Wilson', email: 'james.wilson@ln.hk', role: 'Instructor' }
    ],
    timetable: [
      { day: 'Tuesday', time: '10:00 - 12:00', venue: 'SEKG01', venueCode: 'SEKG01', type: 'Lab' },
      { day: 'Thursday', time: '10:00 - 12:00', venue: 'SEK102', venueCode: 'SEK102', type: 'Lecture' },
      { day: 'Friday', time: '14:00 - 15:00', venue: 'SEK102', venueCode: 'SEK102', type: 'Tutorial' }
    ],
    assignments: [
      { id: 1, title: 'Data Analysis Project', dueDate: '2024-12-20', status: 'pending' },
      { id: 2, title: 'Machine Learning Model', dueDate: '2025-01-05', status: 'pending' }
    ]
  },
  {
    id: 5,
    title: 'Creative Writing Workshop',
    instructor: 'Prof. Lisa Anderson',
    category: 'Arts & Humanities',
    duration: '5 weeks',
    students: 650,
    rating: 4.6,
    description: 'Develop your writing skills through exercises and peer feedback.',
    image: '✍️',
    participants: [
      { name: 'Paul Au', email: 'paul.au@ln.hk', role: 'Student' },
      { name: 'Quinn Mak', email: 'quinn.mak@ln.hk', role: 'Student' },
      { name: 'Rachel So', email: 'rachel.so@ln.hk', role: 'Student' },
      { name: 'Prof. Lisa Anderson', email: 'lisa.anderson@ln.hk', role: 'Instructor' }
    ],
    timetable: [
      { day: 'Wednesday', time: '16:00 - 18:00', venue: 'LKK105', venueCode: 'LKK105', type: 'Workshop' }
    ],
    assignments: [
      { id: 1, title: 'Short Story Submission', dueDate: '2024-12-16', status: 'pending' },
      { id: 2, title: 'Poetry Collection', dueDate: '2024-12-28', status: 'pending' }
    ]
  },
  {
    id: 6,
    title: 'Introduction to Psychology',
    instructor: 'Dr. Robert Brown',
    category: 'Social Sciences',
    duration: '12 weeks',
    students: 3200,
    rating: 4.7,
    description: 'Explore the fundamentals of human behavior and mental processes.',
    image: '🧠',
    participants: [
      { name: 'Sam Tse', email: 'sam.tse@ln.hk', role: 'Student' },
      { name: 'Tina Fong', email: 'tina.fong@ln.hk', role: 'Student' },
      { name: 'Victor Ko', email: 'victor.ko@ln.hk', role: 'Student' },
      { name: 'Wendy Hui', email: 'wendy.hui@ln.hk', role: 'Student' },
      { name: 'Dr. Robert Brown', email: 'robert.brown@ln.hk', role: 'Instructor' }
    ],
    timetable: [
      { day: 'Monday', time: '09:00 - 11:00', venue: 'LBY102', venueCode: 'LBY102', type: 'Lecture' },
      { day: 'Wednesday', time: '09:00 - 10:00', venue: 'LKK301', venueCode: 'LKK301', type: 'Tutorial' }
    ],
    assignments: [
      { id: 1, title: 'Research Paper', dueDate: '2024-12-22', status: 'pending' },
      { id: 2, title: 'Final Exam', dueDate: '2025-01-10', status: 'pending' }
    ]
  }
]

// Canteen menu items
const canteenMenu = [
  { id: 1, name: 'Chicken Rice', price: 35, category: 'Main Course' },
  { id: 2, name: 'Beef Noodles', price: 42, category: 'Main Course' },
  { id: 3, name: 'Vegetable Curry', price: 38, category: 'Main Course' },
  { id: 4, name: 'Fried Rice', price: 32, category: 'Main Course' },
  { id: 5, name: 'Sandwich Set', price: 28, category: 'Light Meal' },
  { id: 6, name: 'Salad Bowl', price: 30, category: 'Light Meal' },
  { id: 7, name: 'Coffee', price: 15, category: 'Beverage' },
  { id: 8, name: 'Tea', price: 12, category: 'Beverage' },
  { id: 9, name: 'Soft Drink', price: 10, category: 'Beverage' }
]

const CourseBrowser = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Courses')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedFiles, setSelectedFiles] = useState({})
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showTimetable, setShowTimetable] = useState(false)
  const [showCanteen, setShowCanteen] = useState(false)

  const filteredCourses = sampleCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All Courses' || course.category === selectedCategory
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = ['All Courses', ...new Set(sampleCourses.map(c => c.category))]

  return (
    <div className="py-6">
      {/* Filters */}
      <div className="moodle-block mb-6">
        <div className="moodle-block-header flex items-center justify-between">
          <h2 className="text-lg font-bold text-orange-700 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Courses</span>
          </h2>
        </div>
        <div className="moodle-block-content">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded border text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
        </div>
      </div>

      {/* Timetable Section */}
      <div className="mb-6">
        <div className="moodle-block">
          <div className="moodle-block-header flex items-center justify-between">
            <h2 className="text-lg font-bold text-orange-700 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>My Timetable</span>
            </h2>
            <button
              onClick={() => setShowTimetable(!showTimetable)}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              {showTimetable ? 'Hide' : 'Show'}
            </button>
          </div>
          {showTimetable && (
            <div className="moodle-block-content p-4">
              <div className="space-y-4">
                {sampleCourses.map(course => (
                  <div key={course.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <span className="text-xl">{course.image}</span>
                      <span>{course.title}</span>
                    </h3>
                    <div className="space-y-2 ml-8">
                      {course.timetable.map((session, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Calendar className="w-4 h-4 text-orange-600" />
                                <h4 className="font-semibold text-gray-800 text-sm">{session.day}</h4>
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                                  {session.type}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 ml-6">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{session.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <BookOpen className="w-3 h-3" />
                                  <span>{session.venue}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Canteen Section */}
      <div className="mb-6">
        <div className="moodle-block">
          <div className="moodle-block-header flex items-center justify-between">
            <h2 className="text-lg font-bold text-orange-700 flex items-center space-x-2">
              <Utensils className="w-5 h-5" />
              <span>Canteen Order</span>
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCart(!showCart)}
                className="btn-primary text-sm flex items-center space-x-2 relative"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowCanteen(!showCanteen)}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                {showCanteen ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {showCanteen && (
            <div className="moodle-block-content p-4">
              {showCart && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Your Order</h4>
                  {cart.length === 0 ? (
                    <p className="text-gray-600 text-sm">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-2 mb-3">
                        {cart.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                            <span className="text-sm text-gray-700">{item.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-800">HK${item.price}</span>
                              <button
                                onClick={() => setCart(prev => prev.filter((_, i) => i !== index))}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                        <span className="font-semibold text-gray-800">
                          Total: HK${cart.reduce((sum, item) => sum + item.price, 0)}
                        </span>
                        <button
                          onClick={() => {
                            if (cart.length === 0) {
                              alert('Your cart is empty')
                              return
                            }
                            alert(`Order placed successfully! Total: HK$${cart.reduce((sum, item) => sum + item.price, 0)}. You will receive a confirmation email.`)
                            setCart([])
                            setShowCart(false)
                          }}
                          className="btn-primary"
                        >
                          Checkout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {['Main Course', 'Light Meal', 'Beverage'].map(category => (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-700 mb-2">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {canteenMenu
                        .filter(item => item.category === category)
                        .map(item => (
                          <div
                            key={item.id}
                            className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">HK${item.price}</p>
                              </div>
                              <button
                                onClick={() => setCart(prev => [...prev, { ...item, id: Date.now() }])}
                                className="btn-primary text-sm flex items-center space-x-1"
                              >
                                <Utensils className="w-4 h-4" />
                                <span>Add</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-orange-700">
          {selectedCategory} ({filteredCourses.length} courses)
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => (
          <div key={course.id} className="moodle-block hover:shadow-md transition-shadow">
            <div className="moodle-block-content">
              {/* Course Image/Icon */}
              <div className="text-6xl text-center mb-4">{course.image}</div>
              
              {/* Course Info */}
              <div className="mb-3">
                <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-1 rounded">
                  {course.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-orange-700 mb-2">
                {course.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>
              
              {/* Course Meta */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{course.rating} rating</span>
                </div>
              </div>
              
              {/* Enroll Button */}
              <div className="flex items-center justify-end pt-3 border-t border-gray-200">
                <button 
                  onClick={() => setSelectedCourse(course)}
                  className="btn-primary text-sm flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="moodle-block">
          <div className="moodle-block-content text-center py-8">
            <p className="text-gray-600">No courses found matching your criteria.</p>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => {
            setSelectedCourse(null)
            setActiveTab('overview')
            setSelectedFiles({})
          }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      )}
    </div>
  )
}

// Course Detail Modal Component
const CourseDetailModal = ({ 
  course, 
  onClose, 
  activeTab, 
  setActiveTab, 
  selectedFiles, 
  setSelectedFiles
}) => {
  const handleFileSelect = (assignmentId, event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFiles(prev => ({
        ...prev,
        [assignmentId]: file
      }))
    }
  }

  const handleSubmitAssignment = (assignmentId) => {
    const file = selectedFiles[assignmentId]
    if (!file) {
      alert('Please select a file to submit')
      return
    }
    // Simulate submission
    alert(`Assignment "${course.assignments.find(a => a.id === assignmentId)?.title}" submitted successfully!`)
    setSelectedFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[assignmentId]
      return newFiles
    })
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'participants', label: 'Participants' },
    { id: 'assignments', label: 'Assignments' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-4xl">{course.image}</span>
                <div>
                  <h2 className="text-2xl font-bold">{course.title}</h2>
                  <p className="text-orange-100 text-sm mt-1">{course.instructor}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 px-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Course Description</h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-800">{course.category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-800">{course.duration}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="font-semibold text-gray-800">{course.students.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Rating</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <p className="font-semibold text-gray-800">{course.rating}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Participants</h3>
              <div className="space-y-2">
                {course.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{participant.name}</p>
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{participant.email}</span>
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      participant.role === 'Instructor'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {participant.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignments</h3>
              <div className="space-y-4">
                {course.assignments.map(assignment => (
                  <div
                    key={assignment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{assignment.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assignment.status === 'submitted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {assignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <label className="flex-1">
                        <input
                          type="file"
                          onChange={(e) => handleFileSelect(assignment.id, e)}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                        />
                        <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
                          <Upload className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            {selectedFiles[assignment.id]?.name || 'Choose file...'}
                          </span>
                        </div>
                      </label>
                      <button
                        onClick={() => handleSubmitAssignment(assignment.id)}
                        disabled={!selectedFiles[assignment.id]}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default CourseBrowser

