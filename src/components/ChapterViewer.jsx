import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChapterOverview from './ChapterOverview';
import ChapterActivities from './ChapterActivities';
import ChapterAssessment from './ChapterAssessment';
import ModuleSections from './ModuleSections';

const ChapterViewer = ({ chapter, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [assessmentData, setAssessmentData] = useState(null);
  const [activitiesData, setActivitiesData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load chapter activities and assessment data
  useEffect(() => {
    const loadChapterData = async () => {
      try {
        setLoading(true);
        
        // Try to load activities file for this module
        const moduleNum = chapter.module_number.padStart(2, '0');
        const activitiesResponse = await fetch(`/data/module_${moduleNum}_activities.json`);
        
        if (activitiesResponse.ok) {
          const activitiesJson = await activitiesResponse.json();
          setActivitiesData(activitiesJson);
          
          // Extract assessment data from activities
          if (activitiesJson.activities?.assessment) {
            setAssessmentData(activitiesJson.activities.assessment);
          }
        } else {
          console.log(`No activities file found for module ${moduleNum}`);
          // Fallback to generate basic assessment from chapter data
          setAssessmentData(generateBasicAssessment(chapter));
        }
      } catch (error) {
        console.error('Error loading chapter data:', error);
        // Fallback to generate basic assessment
        setAssessmentData(generateBasicAssessment(chapter));
      } finally {
        setLoading(false);
      }
    };

    if (chapter) {
      loadChapterData();
    }
  }, [chapter]);

  // Generate a basic assessment if no activities file exists
  const generateBasicAssessment = (chapterData) => {
    return {
      id: `chapter_${chapterData.module_number}_assessment`,
      title: `${chapterData.module_title} Assessment`,
      passing_score: 70,
      questions: [
        {
          id: 'q1',
          text: `What is the primary focus of ${chapterData.module_title}?`,
          options: [
            "Patient comfort and care",
            "Professional development", 
            chapterData.key_focus_areas?.[0] || "Understanding key concepts",
            "Documentation procedures"
          ],
          correct: 2,
          points: 1
        },
        {
          id: 'q2',
          text: `Which of the following is a key term in ${chapterData.module_title}?`,
          options: [
            chapterData.key_terms?.[0] || "Therapeutic Communication",
            "Hospital Policy",
            "Insurance Coverage", 
            "Medical Equipment"
          ],
          correct: 0,
          points: 1
        },
        {
          id: 'q3',
          text: "Which statement best describes professional boundaries in nursing?",
          options: [
            "Boundaries can be flexible based on patient needs",
            "Boundaries should be maintained consistently to protect both nurse and patient",
            "Boundaries are only important in psychiatric settings",
            "Boundaries limit the therapeutic relationship"
          ],
          correct: 1,
          points: 1
        },
        {
          id: 'q4',
          text: "What is the most appropriate response to a patient who asks personal questions?",
          options: [
            "Answer honestly to build trust",
            "Ignore the question completely",
            "Redirect focus back to the patient therapeutically", 
            "Make up a response to avoid conflict"
          ],
          correct: 2,
          points: 1
        },
        {
          id: 'q5',
          text: "Effective therapeutic communication includes:",
          options: [
            "Giving advice based on personal experience",
            "Active listening and empathy",
            "Sharing similar personal stories",
            "Offering quick solutions to problems"
          ],
          correct: 1,
          points: 1
        }
      ]
    };
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content' },
    { id: 'activities', label: 'Activities' },
    { id: 'assessment', label: 'Assessment' }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapter content...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <ChapterOverview chapter={chapter} />;
      case 'content':
        return <ModuleSections sections={chapter.sections || []} />;
      case 'activities':
        return (
          <ChapterActivities 
            chapter={chapter} 
            activitiesData={activitiesData}
          />
        );
      case 'assessment':
        return assessmentData ? (
          <ChapterAssessment 
            chapter={chapter} 
            assessmentData={assessmentData}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No assessment available for this chapter.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!chapter) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No chapter selected.</p>
      </div>
    );
  }

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
        <h1 className="chapter-title">
          {chapter.title || chapter.module_title}
        </h1>
        <p className="chapter-description">
          {chapter.description || `Chapter ${chapter.module_number} content and activities`}
        </p>
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