import React from 'react';
import { ArrowLeft, BookOpen, ExternalLink, Video, FileText, Users, Phone, Globe } from 'lucide-react';

const Resources = ({ onBack }) => {
  const resourceCategories = [
    {
      title: "Professional Organizations",
      icon: Users,
      color: "blue",
      resources: [
        {
          name: "American Psychiatric Nurses Association (APNA)",
          description: "Professional organization for psychiatric nurses",
          url: "https://www.apna.org",
          type: "website"
        },
        {
          name: "International Society of Psychiatric Nurses (ISPN)",
          description: "Global community of psychiatric mental health nurses",
          url: "https://www.ispn-psych.org",
          type: "website"
        },
        {
          name: "American Organization for Nursing Leadership",
          description: "Leadership development for nursing professionals",
          url: "https://www.aonl.org",
          type: "website"
        }
      ]
    },
    {
      title: "Clinical Guidelines & Evidence",
      icon: FileText,
      color: "green",
      resources: [
        {
          name: "SAMHSA Treatment Guidelines",
          description: "Evidence-based treatment approaches for mental health",
          url: "https://www.samhsa.gov/treatment",
          type: "guidelines"
        },
        {
          name: "APA Practice Guidelines",
          description: "American Psychiatric Association clinical practice guidelines",
          url: "https://www.psychiatry.org/psychiatrists/practice/clinical-practice-guidelines",
          type: "guidelines"
        },
        {
          name: "Cochrane Mental Health Reviews",
          description: "Systematic reviews of mental health interventions",
          url: "https://www.cochranelibrary.com",
          type: "research"
        }
      ]
    },
    {
      title: "Crisis Resources",
      icon: Phone,
      color: "red",
      resources: [
        {
          name: "988 Suicide & Crisis Lifeline",
          description: "24/7 crisis counseling and suicide prevention",
          url: "tel:988",
          type: "crisis",
          note: "Call 988"
        },
        {
          name: "Crisis Text Line",
          description: "24/7 crisis intervention via text message",
          url: "sms:741741",
          type: "crisis",
          note: "Text HOME to 741741"
        },
        {
          name: "SAMHSA National Helpline",
          description: "Treatment referral and information service",
          url: "tel:1-800-662-4357",
          type: "crisis",
          note: "1-800-662-HELP"
        }
      ]
    },
    {
      title: "Educational Resources",
      icon: BookOpen,
      color: "purple",
      resources: [
        {
          name: "NAMI (National Alliance on Mental Illness)",
          description: "Educational programs and support for mental health",
          url: "https://www.nami.org",
          type: "education"
        },
        {
          name: "Mental Health First Aid",
          description: "Training course to help those developing mental health problems",
          url: "https://www.mentalhealthfirstaid.org",
          type: "training"
        },
        {
          name: "CDC Mental Health Resources",
          description: "Public health approach to mental health promotion",
          url: "https://www.cdc.gov/mentalhealth",
          type: "education"
        }
      ]
    },
    {
      title: "Online Learning Platforms",
      icon: Video,
      color: "orange",
      resources: [
        {
          name: "Psychiatric-Mental Health Nurse Review",
          description: "Comprehensive review course for certification",
          url: "https://www.psychiatricnursing.org",
          type: "course"
        },
        {
          name: "Continuing Education for Nurses",
          description: "CE credits for mental health nursing topics",
          url: "https://www.nursingcenter.com",
          type: "education"
        },
        {
          name: "ANCC Certification Resources",
          description: "Preparation for psychiatric nursing certification",
          url: "https://www.nursingworld.org/ancc",
          type: "certification"
        }
      ]
    },
    {
      title: "Reference Materials",
      icon: Globe,
      color: "teal",
      resources: [
        {
          name: "DSM-5-TR Online",
          description: "Diagnostic and Statistical Manual of Mental Disorders",
          url: "https://www.psychiatry.org/psychiatrists/practice/dsm",
          type: "reference"
        },
        {
          name: "Nursing Drug Handbook",
          description: "Comprehensive medication reference for nurses",
          url: "https://www.nursesdrughandbook.com",
          type: "reference"
        },
        {
          name: "Mental Status Examination Tools",
          description: "Standardized assessment instruments",
          url: "https://www.mentalhealthscreening.org",
          type: "tools"
        }
      ]
    }
  ];

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600", 
      red: "text-red-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      teal: "text-teal-600"
    };
    return colors[color] || "text-gray-600";
  };

  const getBgColor = (color) => {
    const colors = {
      blue: "bg-blue-50",
      green: "bg-green-50",
      red: "bg-red-50", 
      purple: "bg-purple-50",
      orange: "bg-orange-50",
      teal: "bg-teal-50"
    };
    return colors[color] || "bg-gray-50";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'website':
      case 'guidelines':
      case 'education':
        return <Globe className="w-4 h-4" />;
      case 'crisis':
        return <Phone className="w-4 h-4" />;
      case 'course':
      case 'training':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

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
        <h1 className="chapter-title">Learning Resources</h1>
        <p className="chapter-description">
          Essential resources for mental health nursing practice and professional development
        </p>
      </div>

      <div className="chapter-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {resourceCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <div key={categoryIndex} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${getBgColor(category.color)}`}>
                    <IconComponent className={`w-6 h-6 ${getIconColor(category.color)}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.title}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {category.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getTypeIcon(resource.type)}
                            <h4 className="font-medium text-gray-900 text-sm">
                              {resource.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {resource.description}
                          </p>
                          {resource.note && (
                            <p className="text-xs font-medium text-blue-600">
                              {resource.note}
                            </p>
                          )}
                        </div>
                        <a
                          href={resource.url}
                          target={resource.type === 'crisis' ? '_self' : '_blank'}
                          rel={resource.type === 'crisis' ? '' : 'noopener noreferrer'}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={`Open ${resource.name}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center mt-0.5">
              <span className="text-yellow-800 text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Important Notice</h4>
              <p className="text-sm text-yellow-700">
                These resources are provided for educational purposes. Always follow your institution's 
                policies and procedures, and consult with supervisors for clinical guidance. In crisis 
                situations, contact emergency services (911) or the resources listed above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;