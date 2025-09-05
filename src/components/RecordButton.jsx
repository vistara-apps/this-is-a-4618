import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import Button from './ui/Button';

const RecordButton = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (onRecordingComplete) {
        onRecordingComplete({
          duration: recordingTime,
          timestamp: new Date().toISOString(),
          // In a real app, this would be the actual audio blob
          audioData: `recording_${Date.now()}.wav`
        });
      }
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Button
          variant={isRecording ? 'destructive' : 'primary'}
          size="lg"
          className={`w-16 h-16 rounded-full ${isRecording ? 'animate-pulse' : ''}`}
          onClick={handleToggleRecording}
        >
          {isRecording ? (
            <Square className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </Button>
        
        {isRecording && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
      
      <div className="text-center">
        {isRecording ? (
          <div className="space-y-1">
            <p className="text-white font-medium">Recording...</p>
            <p className="text-white/70 text-sm">{formatTime(recordingTime)}</p>
          </div>
        ) : (
          <p className="text-white/70 text-sm">Tap to start recording</p>
        )}
      </div>
      
      {isRecording && (
        <div className="text-center text-white/60 text-xs max-w-xs">
          <p>⚠️ Keep your phone steady and speak clearly</p>
        </div>
      )}
    </div>
  );
};

export default RecordButton;