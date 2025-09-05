import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, Globe } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const RightsGuide = ({ stateInfo, scenario }) => {
  const [activeTab, setActiveTab] = useState('rights');
  const [language, setLanguage] = useState('english');

  if (!stateInfo) return null;

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 p-1 bg-white/10 rounded-lg">
        <Button
          variant={activeTab === 'rights' ? 'primary' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => setActiveTab('rights')}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Your Rights
        </Button>
        <Button
          variant={activeTab === 'donts' ? 'primary' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => setActiveTab('donts')}
        >
          <XCircle className="w-4 h-4 mr-2" />
          What NOT to Do
        </Button>
        <Button
          variant={activeTab === 'scripts' ? 'primary' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => setActiveTab('scripts')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Scripts
        </Button>
      </div>

      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            {stateInfo.state} - {scenario?.name || 'General Guidelines'}
          </h3>
          {activeTab === 'scripts' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'english' ? 'spanish' : 'english')}
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === 'english' ? 'ES' : 'EN'}
            </Button>
          )}
        </div>

        {activeTab === 'rights' && (
          <div className="space-y-3">
            {stateInfo.rightsSummary.map((right, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-white/90 leading-relaxed">{right}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'donts' && (
          <div className="space-y-3">
            {stateInfo.donts.map((dont, index) => (
              <div key={index} className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-white/90 leading-relaxed">{dont}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-medium text-white/80 mb-2">
                Suggested Script ({language === 'english' ? 'English' : 'Spanish'}):
              </h4>
              <p className="text-white text-lg leading-relaxed">
                "{language === 'english' ? stateInfo.scriptEnglish : stateInfo.scriptSpanish}"
              </p>
            </div>
            <div className="text-sm text-white/70">
              <p>💡 <strong>Tip:</strong> Speak clearly and calmly. Repeat if necessary.</p>
            </div>
          </div>
        )}
      </Card>

      {stateInfo.legalAlerts?.length > 0 && (
        <Card variant="glass" className="p-4">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            Recent Legal Updates
          </h4>
          <div className="space-y-2">
            {stateInfo.legalAlerts.map((alert, index) => (
              <p key={index} className="text-white/80 text-sm">{alert}</p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RightsGuide;