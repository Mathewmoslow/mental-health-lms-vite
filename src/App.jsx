import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import Progress from './components/Progress.jsx';
import Resources from './components/Resources.jsx';
import ChapterViewer from './components/ChapterViewer.jsx';
import { LearningContextProvider } from './context/LearningContextProvider.jsx';
import './App.css';

function App() {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, progress, resources
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all module JSON files
    const loadChapters = async () => {
      try {
        // Load individual chapter files
        const chapterPromises = [];
        // Only try to load modules 1 and 2 which exist
        for (let i = 1; i <= 2; i++) {
          // Format the number with leading zero if needed
          const chapterNum = i < 10 ? `0${i}` : `${i}`;
          chapterPromises.push(
            fetch(`/data/module_${chapterNum}.json`)
              .then(res => {
                if (!res.ok) {
                  throw new Error(`Failed to load module_${chapterNum}.json`);
                }
                return res.json();
              })
              .catch(err => {
                console.log(`Module ${chapterNum} not found or invalid: ${err.message}`);
                return null; // Return null for failed fetches
              })
          );
        }
        
        const loadedChapters = await Promise.all(chapterPromises);
        const validChapters = loadedChapters.filter(c => c !== null);
        
        if (validChapters.length > 0) {
          // Add a title property if it doesn't exist (using module_title as fallback)
          const chaptersWithTitles = validChapters.map(chapter => ({
            ...chapter,
            title: chapter.title || chapter.module_title || `Chapter ${chapter.module_number}`,
            // Set default progress to 0 if not provided
            progress: chapter.progress || 0
          }));
          
          setChapters(chaptersWithTitles);
          console.log(`Loaded ${validChapters.length} chapters:`, validChapters);
        } else {
          console.error('No valid chapters found in /data directory');
          setChapters([]); // Set empty array to indicate no chapters found
        }
      } catch (error) {
        console.error('Error loading chapters:', error);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, []);

  // Handle navigation from header
  const handleNavigation = (view) => {
    setCurrentView(view);
    setCurrentChapter(null); // Close any open chapter when navigating
  };

  // Handle chapter selection from dashboard
  const handleSelectChapter = (chapter) => {
    setCurrentChapter(chapter);
    setCurrentView('chapter');
  };

  // Handle back navigation
  const handleBack = () => {
    setCurrentChapter(null);
    setCurrentView('dashboard');
  };

  // Render current view
  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading chapter content...</p>
          </div>
        </div>
      );
    }

    if (chapters.length === 0) {
      return (
        <div className="error">
          <div className="text-center py-12">
            <p>No chapters found. Please ensure chapter files are available in the /data directory.</p>
          </div>
        </div>
      );
    }

    // Show chapter viewer if a chapter is selected
    if (currentChapter) {
      return (
        <ChapterViewer 
          chapter={currentChapter} 
          onBack={handleBack}
        />
      );
    }

    // Show appropriate view based on currentView state
    switch (currentView) {
      case 'progress':
        return <Progress onBack={handleBack} />;
      case 'resources':
        return <Resources onBack={handleBack} />;
      case 'dashboard':
      default:
        return (
          <Dashboard 
            chapters={chapters} 
            onSelectChapter={handleSelectChapter}
          />
        );
    }
  };

  return (
    <LearningContextProvider>
      <div className="app">
        <Header 
          currentView={currentView}
          onNavigate={handleNavigation}
        />
        <div className="content">
          {renderCurrentView()}
        </div>
      </div>
    </LearningContextProvider>
  );
}

export default App;