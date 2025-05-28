import { useState, useEffect } from 'react';
import LearningContext from './LearningContext.jsx';

export const LearningContextProvider = ({ children }) => {
  const [progress, setProgress] = useState({});
  const [activityProgress, setActivityProgress] = useState({});
  
  // Load saved data on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('mentalHealthNursingProgress');
      const savedActivities = localStorage.getItem('mentalHealthNursingActivities');
      
      if (savedProgress) setProgress(JSON.parse(savedProgress));
      if (savedActivities) setActivityProgress(JSON.parse(savedActivities));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);
  
  // Save progress when it changes
  useEffect(() => {
    try {
      localStorage.setItem('mentalHealthNursingProgress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [progress]);
  
  // Save activity progress when it changes
  useEffect(() => {
    try {
      localStorage.setItem('mentalHealthNursingActivities', JSON.stringify(activityProgress));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  }, [activityProgress]);
  
  // Activity tracking functions
  const saveActivityProgress = (moduleNumber, activityType, activityId, data) => {
    setActivityProgress(prev => ({
      ...prev,
      [`module_${moduleNumber}`]: {
        ...prev[`module_${moduleNumber}`],
        [activityType]: {
          ...prev[`module_${moduleNumber}`]?.[activityType],
          [activityId]: {
            ...prev[`module_${moduleNumber}`]?.[activityType]?.[activityId],
            ...data,
            lastUpdated: new Date().toISOString()
          }
        }
      }
    }));
  };
  
  const completeActivity = (moduleNumber, activityType, activityId, score = null) => {
    saveActivityProgress(moduleNumber, activityType, activityId, {
      completed: true,
      score: score,
      completedAt: new Date().toISOString()
    });
  };
  
  const getActivityProgress = (moduleNumber, activityType, activityId) => {
    return activityProgress[`module_${moduleNumber}`]?.[activityType]?.[activityId] || {};
  };
  
  const getModuleActivityStats = (moduleNumber) => {
    const moduleActivities = activityProgress[`module_${moduleNumber}`] || {};
    let totalActivities = 0;
    let completedActivities = 0;
    let totalScore = 0;
    let scoredActivities = 0;
    
    Object.values(moduleActivities).forEach(activityType => {
      Object.values(activityType).forEach(activity => {
        totalActivities++;
        if (activity.completed) {
          completedActivities++;
          if (activity.score !== null) {
            totalScore += activity.score;
            scoredActivities++;
          }
        }
      });
    });
    
    return {
      totalActivities,
      completedActivities,
      completionRate: totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0,
      averageScore: scoredActivities > 0 ? totalScore / scoredActivities : null
    };
  };
  
  // Chapter completion functions (existing)
  const completeChapter = (chapterNumber, score = 100) => {
    setProgress(prev => ({
      ...prev,
      [`chapter_${chapterNumber}`]: { 
        completed: true, 
        score: score,
        completedAt: new Date().toISOString()
      }
    }));
  };
  
  const resetChapter = (chapterNumber) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[`chapter_${chapterNumber}`];
      return newProgress;
    });
    
    // Also reset activities for this chapter
    setActivityProgress(prev => {
      const newActivities = { ...prev };
      delete newActivities[`module_${chapterNumber}`];
      return newActivities;
    });
  };
  
  const calculateOverallProgress = (totalChapters) => {
    if (!totalChapters) return 0;
    
    const completedChapters = Object.keys(progress)
      .filter(key => key.startsWith('chapter_') && progress[key]?.completed)
      .length;
      
    return (completedChapters / totalChapters) * 100;
  };
  
  return (
    <LearningContext.Provider 
      value={{ 
        progress, 
        setProgress,
        completeChapter,
        resetChapter,
        calculateOverallProgress,
        // New activity-related functions
        activityProgress,
        saveActivityProgress,
        completeActivity,
        getActivityProgress,
        getModuleActivityStats
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};