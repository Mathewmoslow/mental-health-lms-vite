import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import Progress from './components/Progress.jsx';
import Resources from './components/Resources.jsx';
import ChapterView from './components/ChapterView.jsx';
import { LearningContextProvider } from './context/LearningContextProvider.jsx';
import './App.css';

function App() {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    completedActivities: [],
    scores: {}
  });

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
          // You could set a flag here to show an error message to the user
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

  const updateProgress = (activityId, score) => {
    setProgress(prev => ({
      ...prev,
      completedActivities: [...new Set([...prev.completedActivities, activityId])],
      scores: { ...prev.scores, [activityId]: score }
    }));
  };

  return (
    <LearningContextProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="content">
            {loading ? (
              <div className="loading">
                <p>Loading chapter content...</p>
              </div>
            ) : chapters.length === 0 ? (
              <div className="error">
                <p>No chapters found. Please ensure chapter files are available in the /data directory.</p>
              </div>
            ) : currentChapter ? (
              <ChapterViewer 
                chapter={currentChapter} 
                onBack={() => setCurrentChapter(null)} 
              />
            ) : (
              <Dashboard 
                chapters={chapters} 
                onSelectChapter={setCurrentChapter} 
                loading={loading}
              />
            )}
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<Progress progress={progress} />} />
            <Route path="/resources" element={<Resources />} />
            <Route 
              path="/chapter/:id" 
              element={<ChapterView updateProgress={updateProgress} />} 
            />
          </Routes>
        </div>
      </Router>
    </LearningContextProvider>
  );
}

export default App;