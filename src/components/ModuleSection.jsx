import React from 'react';
import { ChevronRight } from 'lucide-react';
import ActivityBadge from './ActivityBadge';

const ModuleSection = ({ section, expanded, onToggle }) => {
  // Determine activity types for this section based on content
  const getActivityTypes = () => {
    const types = [];
    
    // This is a simplified example - in a real app, you'd analyze section content
    // to determine which activity types are available
    if (section.hasInteractive) types.push('interactive');
    if (section.hasQuiz) types.push('quiz');
    if (section.hasSimulation) types.push('simulation');
    if (section.hasCaseStudy) types.push('case study');
    if (section.hasVideo) types.push('video');
    if (section.hasCalculator) types.push('calculator');
    
    // If no specific activities defined, default to these based on section type
    if (types.length === 0) {
      if (section.type === 'assessment') {
        types.push('quiz');
      } else if (section.type === 'interactive') {
        types.push('interactive');
      } else if (section.type === 'case_study') {
        types.push('case study');
      } else if (section.type === 'simulation') {
        types.push('simulation');
      } else {
        types.push('reading');
      }
    }
    
    return types;
  };

  const activityTypes = getActivityTypes();

  return (
    <div className="section-item">
      <div className="section-header" onClick={onToggle}>
        <div className="section-title">{section.title}</div>
        <div className="section-controls">
          <div className="section-badges">
            {activityTypes.map((type, idx) => (
              <ActivityBadge key={idx} type={type} />
            ))}
          </div>
          <ChevronRight 
            className={`section-chevron ${expanded ? 'expanded' : ''}`}
          />
        </div>
      </div>
      
      {expanded && (
        <div className="section-content">
          {section.content ? (
            <div className="prose">
              {section.content}
            </div>
          ) : (
            <div className="text-gray">
              Content will be displayed here when available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleSection;