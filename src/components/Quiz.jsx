import React, { useState } from 'react';

const Quiz = ({ questions, onComplete }) => {
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId, choice) => {
    if (!submitted) {
      setSelections(prev => ({
        ...prev,
        [questionId]: choice
      }));
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = questions.reduce((acc, question) => {
      return acc + (selections[question.id] === question.correct ? 1 : 0);
    }, 0);
    onComplete && onComplete(score / questions.length * 100);
  };

  return (
    <div className="quiz-container">
      {questions.map(question => (
        <div key={question.id} className="question">
          <h3>{question.text}</h3>
          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option ${selections[question.id] === index ? 'selected' : ''}`}
                onClick={() => handleSelect(question.id, index)}
                disabled={submitted}
              >
                {option}
              </button>
            ))}
          </div>
          {submitted && (
            <div className="feedback">
              {selections[question.id] === question.correct 
                ? "Correct!" 
                : "Incorrect. " + question.rationale}
            </div>
          )}
        </div>
      ))}
      {!submitted && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      )}
    </div>
  );
};

export default Quiz;