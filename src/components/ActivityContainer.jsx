import React, { useState, useContext } from 'react';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  ChevronLeft,
  Award,
  Users,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import LearningContext from '../context/LearningContext';

// Case Study Component with Persistent Scenario
const CaseStudy = ({ caseStudy, moduleNumber, activityType }) => {
  const { completeActivity, getActivityProgress } = useContext(LearningContext);
  const savedProgress = getActivityProgress(moduleNumber, activityType, caseStudy.id);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(savedProgress.answers || {});
  const [showResults, setShowResults] = useState(savedProgress.completed || false);
  const [showRationale, setShowRationale] = useState({});

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    setShowRationale(prev => ({ ...prev, [questionId]: true }));
  };

  const calculateScore = () => {
    const correct = caseStudy.questions.filter(q => 
      answers[q.id] === q.correct
    ).length;
    return (correct / caseStudy.questions.length) * 100;
  };

  const handleComplete = () => {
    const score = calculateScore();
    setShowResults(true);
    completeActivity(moduleNumber, activityType, caseStudy.id, score);
  };

  if (showResults) {
    const score = savedProgress.score || calculateScore();
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <Award className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-2xl font-bold mb-2">Case Study Complete!</h3>
          <p className="text-3xl font-bold text-blue-600">{score.toFixed(0)}%</p>
          <p className="text-gray-600 mt-2">
            You got {caseStudy.questions.filter(q => answers[q.id] === q.correct).length} out of {caseStudy.questions.length} correct
          </p>
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
              setShowRationale({});
            }}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Review Case Study
          </button>
        </div>
      </div>
    );
  }

  const question = caseStudy.questions[currentQuestion];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Case Study Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{caseStudy.title}</h3>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>Question {currentQuestion + 1} of {caseStudy.questions.length}</span>
          <span>Category: {caseStudy.category}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / caseStudy.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Persistent Scenario */}
      <div className="bg-indigo-50 p-4 rounded-lg mb-6 border-l-4 border-indigo-500">
        <div className="flex items-start">
          <Users className="w-5 h-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-indigo-900 mb-2">Case Scenario</h4>
            <p className="text-indigo-800">{caseStudy.scenario}</p>
          </div>
        </div>
      </div>

      {/* Current Question */}
      <div className="mb-6">
        <p className="text-lg font-medium mb-4">{question.text}</p>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, index)}
              disabled={showRationale[question.id]}
              className={`w-full text-left p-4 rounded border-2 transition-all ${
                answers[question.id] === index
                  ? index === question.correct
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : showRationale[question.id] && index === question.correct
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300'
              } ${showRationale[question.id] ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start">
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Rationale */}
        {showRationale[question.id] && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800 mb-1">Clinical Rationale:</p>
                <p className="text-blue-700">{question.rationale}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        
        {currentQuestion === caseStudy.questions.length - 1 ? (
          <button
            onClick={handleComplete}
            disabled={Object.keys(answers).length < caseStudy.questions.length}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Complete Case Study
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={!answers[question.id]}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

// Quiz Component with Progress Tracking
const Quiz = ({ quiz, moduleNumber, activityType }) => {
  const { completeActivity, getActivityProgress } = useContext(LearningContext);
  const savedProgress = getActivityProgress(moduleNumber, activityType, quiz.id);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(savedProgress.answers || {});
  const [showResults, setShowResults] = useState(savedProgress.completed || false);
  const [showRationale, setShowRationale] = useState({});

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    setShowRationale(prev => ({ ...prev, [questionId]: true }));
  };

  const calculateScore = () => {
    const correct = quiz.questions.filter(q => 
      answers[q.id] === q.correct
    ).length;
    return (correct / quiz.questions.length) * 100;
  };

  const handleQuizComplete = () => {
    const score = calculateScore();
    setShowResults(true);
    completeActivity(moduleNumber, activityType, quiz.id, score);
  };

  const question = quiz.questions[currentQuestion];

  if (showResults) {
    const score = savedProgress.score || calculateScore();
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <Award className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-3xl font-bold text-blue-600">{score.toFixed(0)}%</p>
          <p className="text-gray-600 mt-2">
            You got {quiz.questions.filter(q => answers[q.id] === q.correct).length} out of {quiz.questions.length} correct
          </p>
          {savedProgress.completed && (
            <p className="text-sm text-gray-500 mt-4">
              Completed on {new Date(savedProgress.completedAt).toLocaleDateString()}
            </p>
          )}
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
              setShowRationale({});
            }}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">{quiz.title}</h3>
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-lg mb-4">{question.text}</p>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, index)}
              disabled={showRationale[question.id]}
              className={`w-full text-left p-4 rounded border-2 transition-all ${
                answers[question.id] === index
                  ? index === question.correct
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : showRationale[question.id] && index === question.correct
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300'
              } ${showRationale[question.id] ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {showRationale[question.id] && (
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-sm font-medium text-blue-800">Rationale:</p>
            <p className="text-sm text-blue-700">{question.rationale}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Previous
        </button>
        
        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleQuizComplete}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={!answers[question.id]}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

// Term Match with Progress Tracking
const TermMatch = ({ activity, moduleNumber, activityType }) => {
  const { completeActivity, getActivityProgress } = useContext(LearningContext);
  const savedProgress = getActivityProgress(moduleNumber, activityType, activity.id);
  
  const [matches, setMatches] = useState(savedProgress.matches || {});
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(savedProgress.completed || false);

  const handleDrop = (term, definition) => {
    setMatches(prev => ({ ...prev, [term]: definition }));
  };

  const checkAnswers = () => {
    const correct = activity.items.every(item => 
      matches[item.term] === item.definition
    );
    setCompleted(correct);
    setFeedback(correct ? 'Perfect! All matches are correct.' : 'Some matches are incorrect. Try again!');
    
    if (correct) {
      completeActivity(moduleNumber, activityType, activity.id, 100);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{activity.title}</h3>
          <p className="text-gray-600 mt-1">{activity.instructions}</p>
        </div>
        {completed && savedProgress.completedAt && (
          <div className="text-sm text-green-600 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Terms</h4>
          {activity.items.map(item => (
            <div
              key={item.term}
              className="bg-blue-50 p-3 mb-2 rounded cursor-move"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('term', item.term)}
            >
              {item.term}
            </div>
          ))}
        </div>
        
        <div>
          <h4 className="font-medium mb-3">Definitions</h4>
          {activity.items.map(item => (
            <div
              key={item.definition}
              className="bg-gray-50 p-3 mb-2 rounded min-h-[60px] border-2 border-dashed"
              onDrop={(e) => {
                e.preventDefault();
                const term = e.dataTransfer.getData('term');
                handleDrop(term, item.definition);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {Object.entries(matches).find(entry => entry[1] === item.definition)?.[0] || item.definition}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={checkAnswers}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Check Answers
        </button>
        {feedback && (
          <div className={`flex items-center ${completed ? 'text-green-600' : 'text-red-600'}`}>
            {completed ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

// Decision Tree Component
const DecisionTree = ({ activity, moduleNumber, activityType }) => {
  const { completeActivity, getActivityProgress } = useContext(LearningContext);
  const savedProgress = getActivityProgress(moduleNumber, activityType, activity.id);
  
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);
    
    if (choice.result === 'therapeutic') {
      completeActivity(moduleNumber, activityType, activity.id, 100);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{activity.title}</h3>
        {savedProgress.completed && (
          <div className="text-sm text-green-600 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded mb-6">
        <p className="font-medium">Scenario:</p>
        <p className="mt-2">{activity.scenario}</p>
      </div>
      
      <div className="space-y-3">
        {activity.choices.map(choice => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice)}
            className={`w-full text-left p-4 rounded border-2 transition-all ${
              selectedChoice?.id === choice.id
                ? choice.result === 'therapeutic'
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start">
              <span className="font-medium mr-3">{choice.id}.</span>
              <div className="flex-1">
                <p>{choice.text}</p>
                {showFeedback && selectedChoice?.id === choice.id && (
                  <p className={`mt-2 text-sm ${
                    choice.result === 'therapeutic' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {choice.feedback}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Communication Simulation Component
const CommunicationSimulation = ({ activity, moduleNumber, activityType }) => {
  const { completeActivity, saveActivityProgress, getActivityProgress } = useContext(LearningContext);
  const savedProgress = getActivityProgress(moduleNumber, activityType, activity.id);
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponses, setSelectedResponses] = useState(savedProgress.responses || {});
  const [showFeedback, setShowFeedback] = useState({});

  const scenario = activity.scenarios[currentScenario];

  const handleResponseSelect = (scenarioId, responseIndex) => {
    const newResponses = { ...selectedResponses, [scenarioId]: responseIndex };
    setSelectedResponses(newResponses);
    setShowFeedback(prev => ({ ...prev, [scenarioId]: true }));
    
    // Save progress
    saveActivityProgress(moduleNumber, activityType, activity.id, {
      responses: newResponses,
      currentScenario
    });
    
    // Check if all scenarios completed with therapeutic responses
    const allCompleted = activity.scenarios.every(s => 
      newResponses[s.id] !== undefined && 
      s.responses[newResponses[s.id]]?.therapeutic
    );
    
    if (allCompleted) {
      completeActivity(moduleNumber, activityType, activity.id, 100);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">{activity.title}</h3>
      <p className="text-gray-600 mb-6">{activity.instructions}</p>
      
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded mb-4">
          <div className="flex items-start">
            <MessageCircle className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Patient says:</p>
              <p className="mt-2 text-blue-700 italic">"{scenario.patient_statement}"</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {scenario.responses.map((response, index) => (
            <button
              key={index}
              onClick={() => handleResponseSelect(scenario.id, index)}
              disabled={showFeedback[scenario.id]}
              className={`w-full text-left p-4 rounded border-2 transition-all ${
                selectedResponses[scenario.id] === index
                  ? response.therapeutic
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <p className="font-medium">{response.text}</p>
              {showFeedback[scenario.id] && selectedResponses[scenario.id] === index && (
                <p className={`mt-2 text-sm ${
                  response.therapeutic ? 'text-green-700' : 'text-red-700'
                }`}>
                  {response.feedback}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Scenario {currentScenario + 1} of {activity.scenarios.length}
        </div>
        
        {currentScenario < activity.scenarios.length - 1 && (
          <button
            onClick={() => setCurrentScenario(currentScenario + 1)}
            disabled={!showFeedback[scenario.id]}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Next Scenario →
          </button>
        )}
      </div>
    </div>
  );
};

// Assessment Component
const Assessment = ({ activity, moduleNumber, activityType }) => {
  const { completeActivity, getActivityProgress } = useContext(LearningContext);
  const savedProgress = getActivityProgress(moduleNumber, activityType, activity.id);
  
  const [answers, setAnswers] = useState(savedProgress.answers || {});
  const [submitted, setSubmitted] = useState(savedProgress.completed || false);
  const [score, setScore] = useState(savedProgress.score || 0);

  const handleAnswer = (questionId, answerIndex) => {
    if (!submitted) {
      setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    }
  };

  const submitAssessment = () => {
    let earnedPoints = 0;
    let totalPoints = 0;
    
    activity.questions.forEach(q => {
      const points = q.points || 1;
      totalPoints += points;
      if (answers[q.id] === q.correct) {
        earnedPoints += points;
      }
    });
    
    const calculatedScore = (earnedPoints / totalPoints) * 100;
    setScore(calculatedScore);
    setSubmitted(true);
    completeActivity(moduleNumber, activityType, activity.id, calculatedScore);
  };

  const retakeAssessment = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4">{activity.title}</h3>
      
      {submitted && (
        <div className={`mb-6 p-4 rounded-lg text-center ${
          score >= activity.passing_score ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <p className="text-3xl font-bold mb-2">{score.toFixed(0)}%</p>
          <p className="text-lg">
            {score >= activity.passing_score 
              ? '🎉 Congratulations! You passed!' 
              : `Keep practicing. You need ${activity.passing_score}% to pass.`}
          </p>
          {savedProgress.completedAt && (
            <p className="text-sm text-gray-600 mt-2">
              Completed on {new Date(savedProgress.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="space-y-6">
        {activity.questions.map((question, qIndex) => (
          <div key={question.id} className="border-b pb-4">
            <p className="font-medium mb-3">
              {qIndex + 1}. {question.text} 
              {question.points > 1 && <span className="text-sm text-gray-500 ml-2">({question.points} points)</span>}
            </p>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <label
                  key={oIndex}
                  className={`block p-3 rounded border cursor-pointer ${
                    submitted
                      ? oIndex === question.correct
                        ? 'bg-green-50 border-green-500'
                        : answers[question.id] === oIndex
                          ? 'bg-red-50 border-red-500'
                          : 'border-gray-200'
                      : answers[question.id] === oIndex
                        ? 'bg-blue-50 border-blue-500'
                        : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    checked={answers[question.id] === oIndex}
                    onChange={() => handleAnswer(question.id, oIndex)}
                    disabled={submitted}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={submitted ? retakeAssessment : submitAssessment}
          disabled={!submitted && Object.keys(answers).length < activity.questions.length}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitted ? 'Retake Assessment' : 'Submit Assessment'}
        </button>
      </div>
    </div>
  );
};

// Main Activity Container
const ActivityContainer = ({ activities, activityType, moduleNumber }) => {
  const { getModuleActivityStats } = useContext(LearningContext);
  const [currentActivity, setCurrentActivity] = useState(0);
  
  const stats = getModuleActivityStats(moduleNumber);

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No activities available yet</p>
      </div>
    );
  }

  const activity = activities[currentActivity];

  const renderActivity = () => {
    const props = { 
      moduleNumber, 
      activityType,
      activity
    };

    switch (activityType) {
      case 'interactive':
        if (activity.type === 'term_match') return <TermMatch {...props} />;
        if (activity.type === 'decision_tree') return <DecisionTree {...props} />;
        break;
      case 'quizzes':
        return <Quiz quiz={activity} moduleNumber={moduleNumber} activityType={activityType} />;
      case 'case_studies':
        return <CaseStudy caseStudy={activity} moduleNumber={moduleNumber} activityType={activityType} />;
      case 'simulations':
        return <CommunicationSimulation {...props} />;
      case 'assessment':
        return <Assessment {...props} />;
      default:
        return <div>Activity type not implemented</div>;
    }
  };

  return (
    <div>
      {/* Progress Summary */}
      {stats.totalActivities > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-700">Module Progress</p>
            <p className="text-lg font-semibold text-blue-900">
              {stats.completedActivities} of {stats.totalActivities} activities completed
            </p>
          </div>
          {stats.averageScore !== null && (
            <div className="text-right">
              <p className="text-sm text-blue-700">Average Score</p>
              <p className="text-lg font-semibold text-blue-900">{stats.averageScore.toFixed(0)}%</p>
            </div>
          )}
        </div>
      )}

      {renderActivity()}
      
      {activities.length > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {activities.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentActivity(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentActivity ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityContainer;