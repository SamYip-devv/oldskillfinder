# Pathfinder - Personality-Based Career Discovery Platform

A modern, minimalistic web platform designed for young people to discover their career potential through AI-powered personality test analysis.

## 🌟 Features

- **Multiple Personality Test Support**: Upload results from 4 major personality assessments:
  - Big 5 Personality Test
  - Gardner Multiple Intelligence Test
  - RIASEC Career Interest Test
  - Gallup CliftonStrengths 34

- **AI-Powered Analysis**: Uses DeepSeek API to analyze personality data and provide personalized career recommendations

- **Comprehensive Recommendations**: Get insights on:
  - Career path suggestions with match percentages
  - Skills to develop
  - Educational recommendations
  - Ideal work environment preferences
  - Actionable next steps

- **Modern UI/UX**: 
  - Clean, bright, and minimalistic design
  - Optimized for young users
  - Drag-and-drop file upload
  - Responsive design for all devices
  - Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pathfinder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if exists) or create a new `.env` file in the root directory
   - Add your DeepSeek API key:
   ```
   VITE_DEEPSEEK_API_KEY=sk-your-api-key-here
   ```
   - Get your API key from [DeepSeek Platform](https://platform.deepseek.com/)
   - **Important**: Never commit your `.env` file to git - it's already in `.gitignore`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

## 📁 Project Structure

```
pathfinder/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── TestUpload.jsx
│   │   └── RecommendationsDisplay.jsx
│   ├── services/
│   │   └── openRouter.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design Philosophy

- **Minimalistic**: Clean, uncluttered interface focusing on functionality
- **Bright & Friendly**: Welcoming color palette with gradients and modern styling
- **Youth-Oriented**: Designed specifically for young people exploring career options
- **Accessible**: Easy-to-use interface with clear visual feedback

## 🔧 Technologies Used

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom design system
- **File Handling**: react-dropzone for drag-and-drop uploads
- **Icons**: Lucide React for modern iconography
- **API Integration**: Axios for DeepSeek API communication
- **AI Model**: DeepSeek Chat via DeepSeek API

## 📊 Supported File Types

- PDF files (.pdf)
- Text files (.txt)
- Image files (.png, .jpg, .jpeg)

## 🤖 AI Analysis

The platform uses advanced AI to analyze personality test results and provide:

- Personalized career path recommendations
- Skills development suggestions
- Educational guidance
- Work environment preferences
- Strategic next steps for career development

## 📱 Responsive Design

The platform is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🔮 Future Features

- Interactive progress tracking map
- User profiles and progress saving
- Social sharing of results
- Integration with job search platforms
- Expanded personality test support

## 🚀 Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ for young people discovering their career potential** 