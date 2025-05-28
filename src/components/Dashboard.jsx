import React from 'react';
import { 
  Brain, 
  FileQuestion, 
  BookOpen, 
  Video, 
  Target, 
  Calculator, 
  GitBranch, 
  FileText,
  Activity 
} from 'lucide-react';

const ActivityBadge = ({ type }) => {
  const getTypeConfig = (type) => {
    const typeLower = type.toLowerCase();
    const configs = {
      'interactive': { color: 'interactive', Icon: Brain },
      'interactive mse': { color: 'interactive', Icon: Brain },
      'quiz': { color: 'quiz', Icon: FileQuestion },
      'simulation': { color: 'simulation', Icon: Brain },
      'case study': { color: 'case-study', Icon: FileText },
      'case-study': { color: 'case-study', Icon: FileText },
      'reading': { color: 'reading', Icon: BookOpen },
      'video': { color: 'video', Icon: Video },
      'practice': { color: 'practice', Icon: Target },
      'calculator': { color: 'calculator', Icon: Calculator },
      'decision tree': { color: 'decision-tree', Icon: GitBranch }
    };
    
    return configs[typeLower] || { color: 'gray', Icon: Activity };
  };
  
  const config = getTypeConfig(type);
  const Icon = config.Icon;
  
  return (
    <span className={`activity-badge badge-${config.color}`}>
      <Icon />
      {type}
    </span>
  );
};

const Dashboard = ({ chapters, onSelectChapter }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {chapters.map((chapter, idx) => {
          const progress = chapter.progress || 0;
          
          return (
            <div 
              key={idx} 
              className="module-card"
              onClick={() => onSelectChapter(chapter)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectChapter(chapter);
                }
              }}
            >
              <h2 className="module-title">{chapter.title}</h2>
              <p className="module-subtitle">
                {chapter.description || `Chapter ${idx + 1} content and activities`}
              </p>
              
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="stats">
                <span>{progress}% Complete</span>
                <span>{chapter.activities?.length || 0} Activities</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;