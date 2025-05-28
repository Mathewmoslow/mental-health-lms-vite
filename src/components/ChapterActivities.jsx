import React, { useState, useContext } from 'react';
import { Brain, BookOpen, FileQuestion, Users, CheckCircle } from 'lucide-react';
import LearningContext from '../context/LearningContext';

const ChapterActivities = ({ chapter }) => {
  const [currentActivity, setCurrentActivity] = useState(null);
  const [activityProgress, setActivityProgress] = useState({});
  const { completeChapter } = useContext(LearningContext);

  // Define structured activities for each chapter
  const activities = [
    {
      id: 'interactive-1',
      type: 'Interactive Learning',
      title: 'Therapeutic vs Social Relationships',
      description: 'Explore key differences through interactive scenarios',
      icon: Brain,
      duration: '15 min',
      content: {
        scenarios: [
          {
            setup: "A patient says: 'You remind me of my daughter. Can I have your phone number to talk when I'm discharged?'",
            question: "What is the most therapeutic response?",
            options: [
              { text: "I'm flattered, but our relationship must remain professional", correct: true },
              { text: "Sure, I'd be happy to help you after discharge", correct: false },
              { text: "Let me ask my supervisor first", correct: false },
              { text: "Why do I remind you of your daughter?", correct: false }
            ],
            explanation: "Maintaining professional boundaries is essential in therapeutic relationships. The nurse should kindly but firmly redirect the conversation."
          }
        ]
      }
    },
    {
      id: 'case-study-1',
      type: 'Case Study',
      title: 'Managing Transference',
      description: 'Analyze a complex patient interaction',
      icon: BookOpen,
      duration: '20 min',
      content: {
        scenario: "Sarah, a 28-year-old patient with borderline personality disorder, has been on the unit for a week. She tells her nurse: 'You remind me of my mother who abandoned me. I know you're going to leave me too, just like everyone else does.'",
        questions: [
          {
            text: "What type of phenomenon is Sarah experiencing?",
            type: "multiple-choice",
            options: ["Countertransference", "Transference", "Resistance", "Projection"],
            correct: 1
          },
          {
            text: "How should the nurse respond?",
            type: "open-ended",
            sampleAnswer: "The nurse should acknowledge Sarah's feelings while maintaining boundaries: 'I hear that you're worried about being abandoned. I'll be here during my scheduled shifts, and we'll work together on your treatment goals.'"
          }
        ]
      }
    },
    {
      id: 'quiz-1',
      type: 'Knowledge Check',
      title: 'Communication Techniques Quiz',
      description: 'Test your understanding of therapeutic communication',
      icon: FileQuestion,
      duration: '10 min',
      content: {
        questions: [
          {
            text: "Which phase of the therapeutic relationship involves reviewing the patient's chart before meeting?",
            options: ["Orientation", "Pre-orientation", "Working", "Termination"],
            correct: 1
          },
          {
            text: "Active listening includes all of the following EXCEPT:",
            options: [
              "Maintaining eye contact",
              "Giving advice",
              "Nodding appropriately",
              "Paraphrasing"
            ],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'simulation-1',
      type: 'Role-Play Simulation',
      title: 'First Patient Meeting',
      description: 'Practice orientation phase skills',
      icon: Users,
      duration: '25 min',
      content: {
        scenario: "You're meeting a new patient admitted for severe depression. Practice introducing yourself and establishing rapport.",
        objectives: [
          "Introduce yourself professionally",
          "Explain your role clearly",
          "Establish meeting schedule",
          "Discuss confidentiality",
          "Begin building trust"
        ]
      }
    }
  ];

  const handleActivityComplete = (activityId) => {
    setActivityProgress(prev => ({
      ...prev,
      [activityId]: true
    }));
    
    // Check if all activities complete
    const allComplete = activities.every(act => 
      activityProgress[act.id] || act.id === activityId
    );
    
    if (allComplete) {
      completeChapter(chapter.module_number);
    }
  };

  const ActivityCard = ({ activity }) => {
    const Icon = activity.icon;
    const isComplete = activityProgress[activity.id];
    
    return (
      <div 
        className={`activityCard ${isComplete ? 'complete' : ''}`}
        onClick={() => setCurrentActivity(activity)}
      >
        <div className="activityHeader">
          <div className={`activityIcon ${activity.type.toLowerCase().replace(/\s+/g, '-')}`}>
            <Icon size={24} />
          </div>
          <div className="activityInfo">
            <span className="activityType">{activity.type}</span>
            <h3 className="activityTitle">{activity.title}</h3>
            <p className="activityDescription">{activity.description}</p>
            <span className="activityDuration">{activity.duration}</span>
          </div>
          {isComplete && (
            <CheckCircle className="completeIcon" size={24} />
          )}
        </div>
      </div>
    );
  };

  const renderActivityContent = () => {
    if (!currentActivity) return null;

    switch (currentActivity.type) {
      case 'Interactive Learning':
        return (
          <div className="activityContent">
            <h2>{currentActivity.title}</h2>
            {currentActivity.content.scenarios.map((scenario, idx) => (
              <div key={idx} className="scenario">
                <p className="scenarioSetup">{scenario.setup}</p>
                <p className="question">{scenario.question}</p>
                <div className="options">
                  {scenario.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      className="optionButton"
                      onClick={() => {
                        if (option.correct) {
                          alert('Correct! ' + scenario.explanation);
                          handleActivityComplete(currentActivity.id);
                        } else {
                          alert('Try again. Think about professional boundaries.');
                        }
                      }}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'Case Study':
        return (
          <div className="activityContent">
            <h2>{currentActivity.title}</h2>
            <div className="caseStudyContent">
              <p className="scenario">{currentActivity.content.scenario}</p>
              {currentActivity.content.questions.map((q, idx) => (
                <div key={idx} className="caseQuestion">
                  <p>{q.text}</p>
                  {q.type === 'multiple-choice' ? (
                    <div className="options">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          className="optionButton"
                          onClick={() => {
                            if (optIdx === q.correct) {
                              alert('Correct!');
                              if (idx === currentActivity.content.questions.length - 1) {
                                handleActivityComplete(currentActivity.id);
                              }
                            } else {
                              alert('Try again.');
                            }
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <textarea 
                        className="openEndedInput"
                        placeholder="Type your answer here..."
                        rows={4}
                      />
                      <button 
                        className="submitButton"
                        onClick={() => {
                          alert('Sample answer: ' + q.sampleAnswer);
                          handleActivityComplete(currentActivity.id);
                        }}
                      >
                        Submit & View Sample Answer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="activityContent">
            <h2>{currentActivity.title}</h2>
            <p>Activity content for {currentActivity.type}</p>
            <button 
              className="completeButton"
              onClick={() => handleActivityComplete(currentActivity.id)}
            >
              Mark as Complete
            </button>
          </div>
        );
    }
  };

  // Calculate progress
  const completedCount = Object.keys(activityProgress).length;
  const progressPercent = (completedCount / activities.length) * 100;

  return (
    <div className="activitiesContainer">
      {!currentActivity ? (
        <>
          <div className="progressBar">
            <div className="progressHeader">
              <h3>Chapter Progress</h3>
              <span>{completedCount} of {activities.length} activities complete</span>
            </div>
            <div className="progressTrack">
              <div 
                className="progressFill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          <div className="activitiesGrid">
            {activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </>
      ) : (
        <div className="activityView">
          <button 
            className="backButton"
            onClick={() => setCurrentActivity(null)}
          >
            ← Back to Activities
          </button>
          {renderActivityContent()}
        </div>
      )}
    </div>
  );
};

export default ChapterActivities;