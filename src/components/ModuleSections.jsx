import React, { useState } from 'react';
import ModuleSection from './ModuleSection';

const ModuleSections = ({ sections }) => {
  const [expandedSections, setExpandedSections] = useState({});
  
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  return (
    <div className="sections-container">
      {sections && sections.map((section, idx) => (
        <ModuleSection 
          key={idx}
          section={section}
          expanded={expandedSections[section.id || idx]}
          onToggle={() => toggleSection(section.id || idx)}
        />
      ))}
    </div>
  );
};

export default ModuleSections;