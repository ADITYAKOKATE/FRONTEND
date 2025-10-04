# 🚀 NASA BioExplorer

A futuristic, AI-powered dashboard for exploring NASA's biology research papers from space experiments. Built for scientists and mission planners to discover insights from 608+ research papers with advanced AI analysis and interactive visualizations.

![NASA BioExplorer](https://img.shields.io/badge/NASA-BioExplorer-blue?style=for-the-badge&logo=space&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🔍 **Smart Search & Filter**
- AI-powered search across titles, abstracts, and keywords
- Advanced filtering by organism, environment, research area, and year
- Real-time search suggestions and autocomplete
- Semantic search capabilities

### 🤖 **AI Summaries & Insights**
- Instant AI-generated summaries of research papers
- Key findings extraction and analysis
- Research gap identification
- Trend analysis and recommendations

### 📊 **Interactive Knowledge Graph**
- D3.js-powered visualization of research relationships
- Interactive nodes showing connections between organisms, missions, and research areas
- Zoomable and explorable graph interface
- Real-time relationship mapping

### 📈 **Trends & Analytics**
- Research progress tracking over time
- Organism and environment distribution analysis
- Impact score visualization
- Citation tracking and analysis

### 📱 **Modern UI/UX**
- Responsive design for all devices
- Space-themed dark mode interface
- Smooth animations with Framer Motion
- Intuitive navigation and user experience

### 📤 **Export Capabilities**
- PDF export of selected papers
- CSV data export for analysis
- AI summary reports
- Custom report generation

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and caching
- **D3.js** - Data visualization and knowledge graphs
- **Recharts** - Chart components
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **OpenAI API** - AI text summarization (placeholder)
- **PDFKit** - PDF generation
- **CSV Writer** - CSV export functionality

### Development Tools
- **Concurrently** - Run multiple commands
- **Nodemon** - Development server auto-restart
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/nasa-bioexplorer.git
cd nasa-bioexplorer
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Setup environment variables**
```bash
# Copy environment templates
cp server/env.example server/.env
```

4. **Start MongoDB**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

5. **Seed the database**
```bash
cd server
npm run seed
cd ..
```

6. **Start the application**
```bash
# Development mode (both frontend and backend)
npm run dev

# Or start individually
npm run server  # Backend only
npm run client  # Frontend only
```

7. **Open your browser**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
nasa-bioexplorer/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── styles/        # CSS and styling
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend application
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── scripts/          # Database scripts
│   ├── index.js          # Server entry point
│   └── package.json
├── data/                 # Sample data and datasets
│   └── samplePapers.js   # Sample NASA research papers
├── package.json          # Root package.json
├── start.sh             # Startup script
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/nasa-bioexplorer
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
```

#### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_VERSION=1.0.0
```

## 📊 API Endpoints

### Papers
- `GET /api/papers` - Get all papers with pagination
- `GET /api/papers/:id` - Get specific paper
- `GET /api/papers/stats/overview` - Get statistics overview
- `POST /api/papers` - Create new paper (admin)
- `PUT /api/papers/:id` - Update paper
- `DELETE /api/papers/:id` - Delete paper

### Search
- `POST /api/search` - Advanced search with AI features
- `GET /api/search/suggestions` - Get search suggestions
- `GET /api/search/filters` - Get available filter options

### Insights
- `GET /api/insights/knowledge-graph` - Generate knowledge graph data
- `GET /api/insights/trends` - Get research trends
- `GET /api/insights/gaps` - Identify research gaps
- `POST /api/insights/summarize` - Generate AI summaries

### Export
- `POST /api/export/pdf` - Export papers as PDF
- `POST /api/export/csv` - Export papers as CSV
- `POST /api/export/summaries` - Export AI summaries

## 🎨 UI Components

### Core Components
- **SearchBar** - Advanced search with suggestions
- **FilterPanel** - Dynamic filtering interface
- **PaperCard** - Research paper display cards
- **StatsOverview** - Statistics dashboard
- **KnowledgeGraph** - D3.js interactive graph
- **TrendsChart** - Research trends visualization
- **InsightsPanel** - AI insights and analysis

### Pages
- **LandingPage** - Futuristic homepage
- **Dashboard** - Main application interface
- **PaperDetail** - Individual paper view
- **NotFound** - 404 error page

## 🔬 Sample Data

The application includes sample NASA biology research papers covering:

- **Human Physiology** - Cardiovascular effects of microgravity
- **Plant Biology** - Growth in lunar regolith
- **Microbiology** - Space environment adaptation
- **Psychology** - Isolation and confinement effects
- **Nutrition** - Long-duration mission requirements
- **Genetics** - Radiation effects on DNA

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t nasa-bioexplorer .

# Run container
docker run -p 3000:3000 -p 5000:5000 nasa-bioexplorer
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set up OpenAI API key for AI features
- Configure CORS for production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for type safety
- Write comprehensive tests
- Follow the existing code style
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** - For providing the research data and inspiration
- **OpenAI** - For AI text processing capabilities
- **D3.js** - For powerful data visualization
- **React Community** - For excellent tools and libraries

## 📞 Support

For support, email support@nasa-bioexplorer.com or join our Slack channel.

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Advanced AI analysis with GPT-4
- [ ] Mobile app development
- [ ] Integration with NASA APIs
- [ ] Machine learning model training
- [ ] Virtual reality visualization
- [ ] Multi-language support
- [ ] Advanced export formats

---

**Built with ❤️ for the future of space exploration**

