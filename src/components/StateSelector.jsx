import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const StateSelector = ({ selectedState, onStateChange, states }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStates = Object.keys(states).filter(state =>
    states[state].state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {selectedState ? states[selectedState].state : 'Select Your State'}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <Card variant="glass" className="absolute top-full mt-2 w-full z-50 max-h-60 overflow-hidden">
          <div className="p-3">
            <input
              type="text"
              placeholder="Search states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredStates.map(stateCode => (
              <button
                key={stateCode}
                className="w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors"
                onClick={() => {
                  onStateChange(stateCode);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {states[stateCode].state}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StateSelector;