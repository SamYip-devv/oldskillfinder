# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development server:**
```bash
npm run dev
```
Runs on http://localhost:3000

**Production build:**
```bash
npm run build
```
Outputs to `dist/` directory

**Linting:**
```bash
npm run lint
```
Uses ESLint with React plugins

**Preview production build:**
```bash
npm run preview
```

## Project Architecture

This is a React-based personality test analysis platform called **Pathfinder** (formerly SkillFinder). The application helps students discover complementary skills based on personality test results.

### Core Application Flow

1. **Entry Point**: `src/main.jsx` → `src/App.jsx`
2. **State Management**: Simple React hooks (useState/useEffect) - no external state library
3. **Main Components**:
   - `Header.jsx`: Navigation and branding
   - `StepWizard.jsx`: Multi-step upload process
   - `ResultsView.jsx`: Display formatted recommendations
   - `TestUpload.jsx`: File upload interface (4 personality test types)
   - `RecommendationsDisplay.jsx`: Detailed career insights
   - `LoadingAnimation.jsx`: Visual feedback during AI processing

### Key Architecture Patterns

- **File Upload**: Uses `react-dropzone` for drag-and-drop functionality
- **AI Integration**: OpenRouter API with GPT-4.1 nano model via `src/services/openRouter.js`
- **State Flow**: App.jsx manages top-level state, passes down via props
- **Styling**: Tailwind CSS with custom design system (bright, youth-oriented)
- **Error Handling**: Comprehensive error states with user-friendly messages

### Supported Personality Tests

The app processes 4 test types:
- Big 5 Personality Test
- Gardner Multiple Intelligence Test  
- RIASEC Career Interest Test
- Gallup CliftonStrengths 34

### AI Service (`src/services/openRouter.js`)

- **Main function**: `analyzeTests(uploadedTests, userDescription, undergraduateDegree)`
- **Prompt Engineering**: Creates structured prompts for skill recommendations
- **Response Format**: Returns structured JSON with skills, career paths, education recommendations
- **Error Handling**: Network errors, API errors, JSON parsing errors

### State Management Approach

- Local component state using React hooks
- `App.jsx` manages global state (recommendations, loading states)
- `StepWizard.jsx` manages upload progress and user input
- Uses localStorage for progress persistence with cleanup on reset

### Design System

- **Colors**: Primary (blue tones), Accent (purple/pink gradients)
- **Typography**: Inter font family
- **Animations**: Custom fade-in, slide-up animations
- **Responsive**: Mobile-first design with Tailwind breakpoints

### File Structure Patterns

- **Components**: Functional components with hooks
- **Services**: API integration and business logic
- **Styling**: Tailwind classes with custom CSS in `src/index.css`
- **Configuration**: Vite build tool with React plugin

## Important Notes

- **API Key**: Currently hardcoded in `src/services/openRouter.js` (should be moved to environment variables)
- **File Support**: PDF, TXT, PNG, JPG, JPEG formats
- **Target Audience**: College students (18-25) exploring career options
- **Design Philosophy**: Minimalistic, bright, encouraging tone for young users
- **Error Recovery**: All error states provide retry mechanisms and clear feedback

## Common Development Patterns

- Always maintain the youth-friendly, encouraging tone in UI text
- Use Tailwind utility classes for styling
- Implement proper error boundaries for AI service calls
- Follow React functional component patterns with hooks
- Keep components focused and reusable
- Use descriptive prop names that match the domain (tests, recommendations, etc.)

## Key Dependencies

- **React 18**: Core framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling framework
- **react-dropzone**: File upload handling
- **axios**: HTTP client for API calls
- **lucide-react**: Icon library


# Pathfinder - Project Reference Guide

## 📋 Project Overview

**Pathfinder** is a modern, minimalistic web platform designed specifically for young people to discover their career potential through AI-powered personality test analysis. The platform allows users to upload results from multiple personality assessments and receive personalized career recommendations.

### 🎯 Target Audience
- Young adults (18-25) exploring career options
- Students unsure about their career path
- Anyone seeking data-driven career guidance

### 🌟 Core Value Proposition
Transform personality test results into actionable career insights using advanced AI analysis.

---

## 🏗️ Architecture & Tech Stack

### **Frontend Framework**
- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **JavaScript (JSX)** - ES6+ syntax

### **Styling & UI**
- **Tailwind CSS** with custom design system
- **Lucide React** for modern iconography
- **Custom CSS** for animations and specific styling
- **Google Fonts (Inter)** for typography

### **State Management**
- **React useState/useEffect** hooks
- Local component state management
- No external state management library (keeps it simple)

### **File Handling**
- **react-dropzone** for drag-and-drop file uploads
- Support for PDF, TXT, and image files
- Client-side file reading with FileReader API

### **AI Integration**
- **OpenRouter API** for AI model access
- **GPT 4.1 nano** as the primary AI model
- **Axios** for HTTP requests
- Custom prompt engineering for personality analysis

### **Development Tools**
- **ESLint** for code linting
- **PostCSS** with Autoprefixer
- **Git** for version control
- **npm** for package management

---

## 📁 File Structure & Descriptions

### **Root Configuration Files**

#### `package.json`
- **Purpose**: Defines project dependencies, scripts, and metadata
- **Key Dependencies**: React, Tailwind CSS, Vite, react-dropzone, axios, lucide-react
- **Scripts**: `dev` (development server), `build` (production build), `lint` (code linting)

#### `vite.config.js`
- **Purpose**: Vite build tool configuration
- **Settings**: React plugin, development server on port 3000

#### `tailwind.config.js`
- **Purpose**: Tailwind CSS configuration with custom design system
- **Custom Colors**: Primary (blue tones), Accent (purple/pink tones)
- **Custom Animations**: fade-in, slide-up for smooth UX
- **Typography**: Inter font family integration

#### `postcss.config.js`
- **Purpose**: PostCSS configuration for CSS processing
- **Plugins**: Tailwind CSS, Autoprefixer

#### `index.html`
- **Purpose**: Main HTML template
- **Features**: Google Fonts integration, meta tags, favicon

#### `.gitignore`
- **Purpose**: Specifies files/folders to exclude from git
- **Excludes**: node_modules, dist, .env files, editor configs

#### `README.md`
- **Purpose**: Project documentation for developers
- **Content**: Installation guide, features, tech stack, deployment info

### **Source Code (`src/` directory)**

#### `src/main.jsx`
- **Purpose**: React application entry point
- **Functionality**: Renders App component into DOM
- **Imports**: React, ReactDOM, App component, global CSS

#### `src/index.css`
- **Purpose**: Global styles and Tailwind CSS imports
- **Custom Classes**: `.card`, `.btn-primary`, `.btn-secondary`
- **Global Styles**: Gradient background, font settings
- **Tailwind Integration**: Base, components, and utilities layers

#### `src/App.jsx`
- **Purpose**: Main application component and state management
- **State Management**: 
  - `uploadedTests`: Tracks uploaded personality test files
  - `recommendations`: Stores AI-generated recommendations
  - `isAnalyzing`: Loading state for AI analysis
- **Key Functions**:
  - `handleTestUpload`: Manages file uploads for different test types
  - Conditional rendering based on upload status and recommendations
- **Components Used**: Header, TestUpload, RecommendationsDisplay

### **Components (`src/components/` directory)**

#### `src/components/Header.jsx`
- **Purpose**: Top navigation and branding
- **Features**:
  - Pathfinder logo with gradient compass icon
  - Navigation links (How it works, About)
  - Call-to-action button
  - Responsive design with mobile considerations
- **Styling**: Glass-morphism effect with backdrop blur

#### `src/components/TestUpload.jsx`
- **Purpose**: Core file upload functionality and UI
- **Key Features**:
  - Drag-and-drop interface for 4 personality test types
  - Visual feedback for upload states
  - File validation and error handling
  - Integration with AI analysis
- **Test Types Supported**:
  - Big 5 Personality Test
  - Gardner Multiple Intelligence Test
  - RIASEC Career Interest Test
  - Gallup CliftonStrengths 34
- **State Management**: Error handling, upload progress
- **File Support**: PDF, TXT, PNG, JPG, JPEG

#### `src/components/StepWizard.jsx`
- **Purpose**: Multi-step user interface for guided experience
- **Functionality**:
  - Step-by-step progression through the platform
  - Visual progress indicators
  - Navigation between different stages
- **Current Stage**: Enhanced user flow and navigation

#### `src/components/ResultsView.jsx`
- **Purpose**: Display formatted AI recommendations
- **Features**:
  - Structured presentation of career recommendations
  - Skills development suggestions
  - Educational pathway guidance
  - Work environment preferences
- **Current Stage**: Improved layout and user experience

#### `src/components/RecommendationsDisplay.jsx`
- **Purpose**: Comprehensive display of AI-generated career insights
- **Sections**:
  - Career paths with match percentages
  - Skills to develop
  - Educational recommendations
  - Ideal work environment
  - Key insights paragraph
  - Actionable next steps
- **Visual Features**:
  - Color-coded recommendation cards
  - Progress bars for match scores
  - Icon-based categorization
  - Responsive grid layout

#### `src/components/LoadingAnimation.jsx`
- **Purpose**: Visual feedback during AI analysis
- **Features**:
  - Animated loading indicators
  - User-friendly messaging
  - Smooth transitions
- **Current Stage**: Enhanced visual feedback system

### **Services (`src/services/` directory)**

#### `src/services/openRouter.js`
- **Purpose**: AI integration and API communication
- **Key Functions**:
  - `analyzeTests()`: Main function for personality analysis
  - `createAnalysisPrompt()`: Builds structured prompts for AI
- **API Configuration**:
  - OpenRouter API integration
  - GPT 4.1 nano model
  - Custom headers and authentication
- **Features**:
  - Robust error handling
  - JSON response parsing
  - Fallback mechanisms
  - Detailed prompt engineering for career analysis
- **Current Status**: Stable with improved error handling

---

## 🔄 Application Logic Flow

### **1. Initial Load**
1. User lands on main page with hero section
2. Header displays navigation and branding
3. Empty upload interface is shown

### **2. File Upload Process**
1. User drags/drops or selects personality test files
2. Files are validated for type and size
3. Content is read using FileReader API
4. Visual feedback shows upload success
5. Upload counter updates in hero section

### **3. AI Analysis Trigger**
1. "Get My Recommendations" button becomes active
2. User clicks to initiate analysis
3. Loading animation displays
4. All uploaded test content is sent to AI via OpenRouter API

### **4. AI Processing**
1. Custom prompt is generated with test results
2. Gemini 2.5 Pro analyzes personality data
3. Structured JSON response is returned
4. Response is parsed and validated

### **5. Results Display**
1. Loading state ends
2. Recommendations component renders
3. Multiple recommendation categories are shown
4. User can review and save insights

### **6. Error Handling**
- Network errors show retry options
- File format errors guide user to correct formats
- AI parsing errors provide fallback messages

---

## 🚀 Current Development Stage

### **✅ Completed Features**
- Complete React application setup with Vite
- Modern UI with Tailwind CSS design system
- Multi-file drag-and-drop upload functionality
- OpenRouter API integration with Gemini 2.5 Pro
- Comprehensive error handling and user feedback
- Responsive design for all device sizes
- Git repository with proper version control
- Deployment-ready build configuration

### **🔧 Recent Enhancements**
- Added StepWizard component for improved user flow
- Implemented LoadingAnimation for better UX
- Enhanced ResultsView component layout
- Updated Header with improved navigation
- Refined styling and visual feedback
- Improved error handling and recovery

### **📊 Current Status**
- **Frontend**: 95% complete
- **AI Integration**: 90% complete
- **Error Handling**: 85% complete
- **Testing**: 60% complete
- **Documentation**: 80% complete



## 🛠️ Development Guidelines

### **Code Standards**
- Use functional components with hooks
- Follow React best practices and patterns
- Maintain consistent naming conventions
- Write descriptive comments for complex logic
- Keep components focused and reusable

### **Git Workflow**
- Commit frequently with descriptive messages
- Use feature branches for new development
- Test changes before pushing to main
- Keep the main branch deployment-ready

### **Performance Considerations**
- Optimize bundle size with proper imports
- Implement lazy loading for large components
- Use React.memo for expensive renders
- Monitor and optimize API call efficiency

### **Security Notes**
- API keys are currently in code (move to environment variables)
- Implement proper input validation
- Add rate limiting for API calls
- Consider implementing user authentication

---

## 🤝 Working with This Project

### **For New Developers**
1. Clone the repository: `git clone https://github.com/kametayturar/pathfinder.git`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Review this document and README.md
5. Explore the codebase starting with `src/App.jsx`

### **For AI Agents**
- This project uses modern React patterns with hooks
- State management is kept simple with local component state
- Focus on maintaining the minimalistic, youth-friendly design
- All AI integration happens through the OpenRouter service
- Error handling should always provide user-friendly feedback
- Keep the bright, encouraging tone in all user-facing text

### **Common Tasks**
- **Adding new features**: Start with component creation in `src/components/`
- **Styling changes**: Use Tailwind classes, custom CSS in `src/index.css`
- **API modifications**: Update `src/services/openRouter.js`
- **Adding dependencies**: Use `npm install <package>` and update package.json

---

## 📞 Support & Resources

- **GitHub Repository**: https://github.com/kametayturar/pathfinder.git
- **Development Server**: http://localhost:3000
- **Documentation**: README.md (user-facing), PROJECT_REFERENCE.md (technical)
- **Tech Stack Docs**: React, Vite, Tailwind CSS, OpenRouter API

---

*Last Updated: January 2025*
*Version: 1.0.0*
*Status: Active Development* 