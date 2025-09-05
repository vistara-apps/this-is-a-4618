import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, FileText, Mic, Book, AlertTriangle, User, Crown, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import StateSelector from './components/StateSelector';
import ScenarioSelector from './components/ScenarioSelector';
import RightsGuide from './components/RightsGuide';
import RecordButton from './components/RecordButton';
import IncidentReport from './components/IncidentReport';
import AuthModal from './components/auth/AuthModal';
import PricingModal from './components/subscription/PricingModal';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import { stateData, scenarios } from './data/stateData';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { locationService } from './services/location';

const AppContent = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [activeSection, setActiveSection] = useState('guide');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  const { user, signOut, isPremium, loading } = useAuth();

  // Auto-detect location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (locationService.isLocationAvailable()) {
          const permission = await locationService.requestLocationPermission();
          
          if (permission === 'granted') {
            const currentState = await locationService.getCurrentState();
            setSelectedState(currentState.stateCode);
            setLocationDetected(true);
          } else {
            // Fallback to common states
            const commonStates = ['CA', 'NY', 'TX', 'FL'];
            const randomState = commonStates[Math.floor(Math.random() * commonStates.length)];
            setSelectedState(randomState);
          }
        } else {
          // Fallback for browsers without geolocation
          const commonStates = ['CA', 'NY', 'TX', 'FL'];
          const randomState = commonStates[Math.floor(Math.random() * commonStates.length)];
          setSelectedState(randomState);
        }
      } catch (error) {
        console.error('Location detection failed:', error);
        // Fallback to common states
        const commonStates = ['CA', 'NY', 'TX', 'FL'];
        const randomState = commonStates[Math.floor(Math.random() * commonStates.length)];
        setSelectedState(randomState);
      }
    };

    detectLocation();
  }, []);

  const handleRecordingComplete = (recordingData) => {
    setRecordings(prev => [...prev, recordingData]);
  };

  const menuItems = [
    { id: 'guide', label: 'Know Your Rights', icon: Book },
    { id: 'record', label: 'Quick Record', icon: Mic },
    { id: 'report', label: 'Incident Report', icon: FileText }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-xl font-bold text-white">LegalShield AI</h1>
                <p className="text-white/60 text-xs hidden sm:block">Your Pocket Guide to Rights & Responsibilities</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Premium Badge */}
              {isPremium() && (
                <div className="flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium ml-2">
                  <Crown className="w-3 h-3" />
                  Premium
                </div>
              )}
              
              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPricingModalOpen(true)}
                  >
                    {isPremium() ? 'Manage' : 'Upgrade'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/30 backdrop-blur-sm border-t border-white/10">
            <div className="px-4 py-3 space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'primary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* State Selection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <StateSelector
              selectedState={selectedState}
              onStateChange={setSelectedState}
              states={stateData}
            />
            {selectedState && (
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <div className={`w-2 h-2 rounded-full ${locationDetected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span>
                  {locationDetected ? 'Location detected' : 'Location set'}: {stateData[selectedState]?.state}
                </span>
              </div>
            )}
          </div>

          {/* Content Sections */}
          {activeSection === 'guide' && (
            <div className="space-y-6">
              <ScenarioSelector
                scenarios={scenarios}
                selectedScenario={selectedScenario}
                onScenarioChange={setSelectedScenario}
              />
              
              {selectedState && (
                <RightsGuide
                  stateInfo={stateData[selectedState]}
                  scenario={selectedScenario}
                />
              )}
            </div>
          )}

          {activeSection === 'record' && (
            <div className="flex flex-col items-center space-y-8">
              <Card variant="glass" className="p-8 text-center max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Quick Record</h2>
                <p className="text-white/70 mb-6">
                  Quickly start recording your interaction. This can serve as evidence and help you remember details later.
                </p>
                
                <RecordButton onRecordingComplete={handleRecordingComplete} />
                
                <div className="mt-6 text-white/60 text-sm space-y-2">
                  <p>💡 <strong>Tips:</strong></p>
                  <ul className="text-left space-y-1">
                    <li>• Keep your phone visible</li>
                    <li>• State the time and location</li>
                    <li>• Remain calm and respectful</li>
                    <li>• Don't interfere with the investigation</li>
                  </ul>
                </div>
              </Card>

              {recordings.length > 0 && (
                <Card variant="glass" className="p-6 w-full max-w-md">
                  <h3 className="text-white font-semibold mb-4">Recent Recordings</h3>
                  <div className="space-y-3">
                    {recordings.slice(-3).map((recording, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded p-3">
                        <div>
                          <p className="text-white text-sm">Recording {recordings.length - index}</p>
                          <p className="text-white/60 text-xs">
                            {Math.floor(recording.duration / 60)}:{(recording.duration % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeSection === 'report' && (
            <div className="flex flex-col items-center">
              <IncidentReport
                selectedState={selectedState}
                stateData={stateData}
              />
            </div>
          )}

          {/* Emergency Notice */}
          <Card variant="glass" className="p-4 border-l-4 border-l-destructive">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-1">Emergency Notice</h4>
                <p className="text-white/80 text-sm">
                  This app provides general legal information and should not replace legal advice from a qualified attorney. 
                  In emergencies, always dial 911. For legal emergencies, contact a criminal defense attorney immediately.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center sm:text-left">
              © 2024 LegalShield AI. Empowering citizens with knowledge.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Terms</Button>
              <Button variant="ghost" size="sm">Support</Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      <PricingModal 
        isOpen={pricingModalOpen} 
        onClose={() => setPricingModalOpen(false)} 
      />

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </div>
  );
};

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
