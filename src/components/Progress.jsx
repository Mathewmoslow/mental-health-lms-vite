import React, { useContext } from 'react';
import { ArrowLeft, CheckCircle, Trophy, BookOpen, Clock } from 'lucide-react';
import LearningContext from '../context/LearningContext';

const Progress = ({ onBack }) => {
  const { progress, calculateOverallProgress } = useContext(LearningContext);

  // Calculate overall statistics
  const completedChapters = Object.keys(progress).filter(key => 
    key.startsWith('chapter_') && progress[key]?.completed
  ).length;

  const totalChapters = 2; // Adjust based on your actual chapter count
  const overallProgress = calculateOverallProgress ? calculateOverallProgress(totalChapters) : 0;

  // Get individual chapter progress
  const chapterStats = Object.keys(progress)
    .filter(key => key.startsWith('chapter_'))
    .map(key => {
      const chapterNumber = key.split('_')[1];
      const chapterData = progress[key];
      return {
        number: chapterNumber,
        ...chapterData
      };
    })
    .sort((a, b) => a.number - b.number);

  const averageScore = chapterStats.length > 0 
    ? chapterStats.reduce((sum, chapter) => sum + (chapter.score || 0), 0) / chapterStats.length
    : 0;

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
        <h1 className="chapter-title">Learning Progress</h1>
        <p className="chapter-description">
          Track your progress through the Mental Health Nursing program
        </p>
      </div>

      <div className="chapter-content">
        {/* Overall Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {overallProgress.toFixed(0)}%
            </h3>
            <p className="text-gray-600">Overall Progress</p>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {completedChapters}/{totalChapters}
            </h3>
            <p className="text-gray-600">Chapters Completed</p>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center mb-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {averageScore.toFixed(0)}%
            </h3>
            <p className="text-gray-600">Average Score</p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Program Progress</h3>
          <div className="progress-bar mb-2">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress: {overallProgress.toFixed(0)}%</span>
            <span>{completedChapters} of {totalChapters} chapters completed</span>
          </div>
        </div>

        {/* Chapter-by-Chapter Progress */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Chapter Progress</h3>
          <div className="space-y-4">
            {[1, 2].map(chapterNum => {
              const chapterProgress = progress[`chapter_${chapterNum}`];
              const isCompleted = chapterProgress?.completed || false;
              const score = chapterProgress?.score || 0;
              const completedDate = chapterProgress?.completedAt;

              return (
                <div key={chapterNum} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-medium">{chapterNum}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Chapter {chapterNum}: {chapterNum === 1 ? 'The Therapeutic Relationship and Communication' : 'Chapter 2'}
                      </h4>
                      {isCompleted && completedDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          Completed {new Date(completedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {isCompleted ? (
                      <div className="text-green-600 font-semibold">
                        {score.toFixed(0)}%
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        Not started
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
          {completedChapters < totalChapters ? (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                Continue with Chapter {completedChapters + 1} to advance your learning progress.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">
                🎉 Congratulations! You've completed all available chapters. 
                Great work on your mental health nursing journey!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;