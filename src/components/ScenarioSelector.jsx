import React from 'react';
import Card from './ui/Card';

const ScenarioSelector = ({ scenarios, selectedScenario, onScenarioChange }) => {
  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Select Situation</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {scenarios.map(scenario => (
          <Card
            key={scenario.id}
            variant={selectedScenario?.id === scenario.id ? 'interactive' : 'glass'}
            className={`p-4 cursor-pointer transition-all ${
              selectedScenario?.id === scenario.id 
                ? 'ring-2 ring-accent' 
                : 'hover:ring-1 hover:ring-white/30'
            }`}
            onClick={() => onScenarioChange(scenario)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{scenario.icon}</span>
              <div>
                <h4 className="text-white font-medium">{scenario.name}</h4>
                <p className="text-white/70 text-sm">{scenario.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScenarioSelector;