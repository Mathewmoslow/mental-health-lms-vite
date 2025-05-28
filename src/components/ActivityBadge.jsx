import React from 'react';
import { 
  Brain, 
  FileQuestion, 
  BookOpen, 
  Video, 
  Target, 
  Calculator, 
  GitBranch, 
  Activity 
} from 'lucide-react';

const ActivityBadge = ({ type }) => {
  const getTypeConfig = (type) => {
    const typeLower = type.toLowerCase();
    const configs = {
      'interactive': { color: 'interactive', Icon: Brain },
      'interactive mse': { color: 'interactive', Icon: Brain },
      'quiz': { color: 'quiz', Icon: FileQuestion },
      'simulation': { color: 'simulation', Icon: Brain },
      'case study': { color: 'case-study', Icon: BookOpen },
      'case-study': { color: 'case-study', Icon: BookOpen },
      'reading': { color: 'reading', Icon: BookOpen },
      'video': { color: 'video', Icon: Video },
      'practice': { color: 'practice', Icon: Target },
      'calculator': { color: 'calculator', Icon: Calculator },
      'decision tree': { color: 'decision-tree', Icon: GitBranch }
    };
    
    return configs[typeLower] || { color: 'gray', Icon: Activity };
  };
  
  const config = getTypeConfig(type);
  const Icon = config.Icon;
  
  return (
    <span className={`activity-badge badge-${config.color}`}>
      <Icon />
      {type}
    </span>
  );
};

export default ActivityBadge;