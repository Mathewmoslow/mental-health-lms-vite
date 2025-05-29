import { useState, useContext, useEffect } from 'react';
import { ClipboardList, Trophy, CheckCircle } from 'lucide-react';
import LearningContext from '../context/LearningContext.jsx';

const ChapterAssessment = ({ chapter, assessmentData }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const { progress, setProgress } = useContext(LearningContext);

  // Use provided assessment data or fallback to generated questions
  const questions = assessmentData?.questions || [];
  const passingScore = assessmentData?.passing_score || 70;
  const assessmentTitle = assessmentData?.title || `${chapter.module_title} Assessment`;

  // Check previous completion status
  useEffect(() => {
    const chapterProgress = progress[`chapter_${chapter.module_number}`];
    if (chapterProgress?.completed) {
      console.log(`This chapter was previously completed with a score of ${chapterProgress.score}%`);
    }
  }, [progress, chapter.module_number]);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const calculateScore = () => {
    const correct = questions.filter(q => answers[q.id] === q.correct).length;
    return questions.length > 0 ? (correct / questions.length) * 100 : 0;
  };

  const handleCompleteAssessment = () => {
    const score = calculateScore();
    // Update progress in context
    setProgress(prev => ({
      ...prev,
      [`chapter_${chapter.module_number}`]: { 
        completed: score >= passingScore, 
        score: score,
        completedAt: new Date().toISOString()
      }
    }));
    
    setShowResults(true);
  };

  // If no questions available, show message
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Assessment Coming Soon</h3>
        <p className="text-gray-600">
          The assessment for this chapter is being prepared.
        </p>
      </div>
    );
  }

  if (!quizStarted) {
    // Check if the chapter has already been completed
    const isCompleted = progress[`chapter_${chapter.module_number}`]?.completed;
    
    return (
      <div className="text-center py-12">
        <ClipboardList className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{assessmentTitle}</h3>
        {isCompleted && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md inline-flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            You've already passed this assessment with a score of {progress[`chapter_${chapter.module_number}`].score}%
          </div>
        )}
        <p className="text-gray-600 mb-2">
          Test your knowledge with {questions.length} questions
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Passing score: {passingScore}%
        </p>
        <button
          onClick={() => setQuizStarted(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
        >
          {isCompleted ? 'Retake Assessment' : 'Start Assessment'}
        </button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= passingScore;
    
    return (
      <div className="text-center py-12">
        <Trophy className={`w-16 h-16 ${passed ? 'text-yellow-500' : 'text-gray-400'} mx-auto mb-4`} />
        <h3 className="text-2xl font-bold mb-2">Assessment Complete!</h3>
        <p className="text-3xl font-bold text-blue-600 mb-4">{score.toFixed(0)}%</p>
        <div className={`mb-6 p-4 rounded-lg ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {passed ? (
            <>
              <CheckCircle className="w-6 h-6 inline mr-2" />
              Congratulations! You passed the assessment.
            </>
          ) : (
            `You need ${passingScore}% to pass. Keep studying and try again.`
          )}
        </div>
        <div className="text-sm text-gray-600 mb-6">
          You got {questions.filter(q => answers[q.id] === q.correct).length} out of {questions.length} questions correct
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setQuizStarted(false);
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
          >
            Retake Assessment
          </button>
          <button
            onClick={() => {
              setQuizStarted(false);
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
            }}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-md"
          >
            Review Questions
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const allAnswersProvided = Object.keys(answers).length >= questions.length;

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-8 h-1 rounded ${
                  idx < currentQuestion ? 'bg-green-600' :
                  idx === currentQuestion ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <h4 className="text-lg font-medium mb-4">{question.text}</h4>
        
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <label 
              key={idx} 
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                answers[question.id] === idx 
                  ? 'bg-blue-100 border border-blue-300' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                answers[question.id] === idx 
                  ? 'border-blue-600' 
                  : 'border-gray-400'
              }`}>
                {answers[question.id] === idx && (
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                )}
              </div>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={idx}
                checked={answers[question.id] === idx}
                onChange={() => handleAnswer(question.id, idx)}
                className="sr-only" // Hidden but accessible
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleCompleteAssessment}
            disabled={!allAnswersProvided}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Assessment
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={answers[question.id] === undefined}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ChapterAssessment;