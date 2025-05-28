import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChapterOverview from './ChapterOverview';
import ChapterActivities from './ChapterActivities';
import ChapterAssessment from './ChapterAssessment';
import ModuleSections from './ModuleSections';

const ChapterViewer = ({ chapter, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content' },
    { id: 'activities', label: 'Activities' },
    { id: 'assessment', label: 'Assessment' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ChapterOverview chapter={chapter} />;
      case 'content':
        return <ModuleSections sections={chapter.sections || []} />;
      case 'activities':
        return <ChapterActivities chapter={chapter} />;
      case 'assessment':
        return <ChapterAssessment chapter={chapter} />;
      default:
        return null;
    }
  };

  return (
    <div className="chapter-container">
      <div className="chapter-header">
        <button 
          className="btn-secondary mb-4"
          onClick={onBack}
          aria-label="Go back to dashboard"
        >
          <ArrowLeft className="icon-sm" />
          Back to Dashboard
        </button>
        <h1 className="chapter-title">{chapter.title || chapter.module_title}</h1>
        <p className="chapter-description">{chapter.description || `Chapter ${chapter.module_number} content and activities`}</p>
      </div>

      <nav className="chapter-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`chapter-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="chapter-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ChapterViewer;