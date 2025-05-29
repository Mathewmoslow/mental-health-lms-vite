import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import ChapterViewer from './components/ChapterViewer.jsx';
import { LearningContextProvider } from './context/LearningContextProvider.jsx';
import './App.css';

function App() {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const chapterPromises = [];
        for (let i = 1; i <= 2; i++) {
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
                console.log(`Module ${chapterNum} not found: ${err.message}`);
                return null;
              })
          );
        }
        
        const loadedChapters = await Promise.all(chapterPromises);
        const validChapters = loadedChapters.filter(c => c !== null);
        
        if (validChapters.length > 0) {
          const chaptersWithTitles = validChapters.map(chapter => ({
            ...chapter,
            title: chapter.title || chapter.module_title || `Chapter ${chapter.module_number}`,
            progress: chapter.progress || 0
          }));
          
          setChapters(chaptersWithTitles);
        } else {
          setChapters([]);
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

  return (
    <LearningContextProvider>
      <div className="app">
        <Header />
        <div className="content">
          {loading ? (
            <div className="loading">
              <p>Loading chapter content...</p>
            </div>
          ) : chapters.length === 0 ? (
            <div className="error">
              <p>No chapters found. Please check /data directory.</p>
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
      </div>
    </LearningContextProvider>
  );
}

export default App;