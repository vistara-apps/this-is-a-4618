import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import toast from 'react-hot-toast';

const RecordButton = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    // Check if MediaRecorder is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      setIsSupported(false);
      return;
    }

    // Check microphone permission
    checkMicrophonePermission();
  }, []);

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

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' });
      setHasPermission(result.state === 'granted');
      
      result.addEventListener('change', () => {
        setHasPermission(result.state === 'granted');
      });
    } catch (error) {
      console.error('Error checking microphone permission:', error);
    }
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please enable microphone permissions.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone.');
      } else {
        toast.error('Failed to access microphone. Please try again.');
      }
      
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      let stream = streamRef.current;
      
      if (!stream) {
        stream = await requestMicrophoneAccess();
      }

      // Clear previous chunks
      audioChunksRef.current = [];

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (onRecordingComplete) {
          onRecordingComplete({
            duration: recordingTime,
            timestamp: new Date().toISOString(),
            audioBlob: audioBlob,
            audioUrl: audioUrl,
            mimeType: mediaRecorder.mimeType,
            size: audioBlob.size
          });
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all tracks to release microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsRecording(false);
    toast.success('Recording stopped');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-white/50" />
        </div>
        <div className="text-white/70 text-sm max-w-xs">
          <p>Audio recording is not supported in your browser.</p>
          <p className="mt-2">Please use a modern browser like Chrome, Firefox, or Safari.</p>
        </div>
      </div>
    );
  }

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
