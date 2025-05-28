import React from 'react';

const ChapterOverview = ({ chapter }) => {
  const objectives = chapter.learning_objectives || [];
  const keyTerms = chapter.key_terms || [];
  const keyFocusAreas = chapter.key_focus_areas || [];

  return (
    <div className="container">
      {objectives.length > 0 && (
        <div className="section">
          <h3 className="sectionTitle">Learning Objectives</h3>
          <ul className="list">
            {objectives.map((obj, idx) => (
              <li key={idx} className="listItem">{obj}</li>
            ))}
          </ul>
        </div>
      )}

      {keyFocusAreas.length > 0 && (
        <div className="section">
          <h3 className="sectionTitle">Key Focus Areas</h3>
          <ul className="list">
            {keyFocusAreas.map((area, idx) => (
              <li key={idx} className="listItem">{area}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="section">
        <h3 className="sectionTitle">Modules in this Chapter</h3>
        <div className="modulesGrid">
          {chapter.sections?.map((section, idx) => (
            <div key={idx} className="moduleCard">
              <h4 className="moduleTitle">{section.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {keyTerms.length > 0 && (
        <div className="section">
          <h3 className="sectionTitle">Key Terms</h3>
          <div className="termsContainer">
            {keyTerms.map((term, idx) => (
              <span key={idx} className="termTag">
                {term}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterOverview;