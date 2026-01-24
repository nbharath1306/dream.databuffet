'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProtocolStore } from '@/store/protocol-store';
import { GapAnalysisReport } from './gap-analysis-report';
import { AlertTriangle, Clock, Maximize } from 'lucide-react';

export function ProtocolEvaluation() {
  const {
    currentModule,
    timeRemaining,
    answers,
    isComplete,
    score,
    startTest,
    setCurrentModule,
    updateAnswer,
    completeTest,
    decrementTime,
    setFullscreen,
  } = useProtocolStore();

  const [hasStarted, setHasStarted] = useState(false);
  const [selectedCodeLine, setSelectedCodeLine] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (!hasStarted || isComplete) return;

    const interval = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, isComplete, decrementTime]);

  // Fullscreen management
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setFullscreen(isFullscreen);

      // If user exits fullscreen during test, penalize and auto-submit
      if (!isFullscreen && hasStarted && !isComplete) {
        alert('⚠️ Fullscreen exit detected. Test will be submitted with penalty.');
        completeTest();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [hasStarted, isComplete, setFullscreen, completeTest]);

  const handleStart = async () => {
    try {
      await document.documentElement.requestFullscreen();
      startTest();
      setHasStarted(true);
    } catch (err) {
      alert('This assessment requires fullscreen mode to maintain integrity.');
    }
  };

  const handleNextModule = () => {
    if (currentModule === 'math') {
      setCurrentModule('incident');
    } else if (currentModule === 'incident') {
      setCurrentModule('architecture');
    }
  };

  const handleSubmit = () => {
    completeTest();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show results if complete
  if (isComplete && score !== null) {
    return <GapAnalysisReport score={score} answers={answers} />;
  }

  // Start screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-bold mb-4">The Protocol</h1>
          <h2 className="text-xl text-gray-600 mb-8">Engineering Evaluation Standard</h2>

          <div className="bg-gray-50 border border-gray-300 p-6 mb-8">
            <h3 className="font-semibold mb-4">Assessment Overview</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span><strong>Duration:</strong> 45 minutes (strict hard stop)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span><strong>Format:</strong> 3 sequential modules (no going back)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span><strong>Evaluation:</strong> Synthesis, not memorization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span><strong>Requirement:</strong> Fullscreen mode (anti-cheat enabled)</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-300 p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Important Notice</p>
              <p>
                This assessment measures production engineering capability. Exiting fullscreen mode
                will result in automatic submission with penalties. Ensure a quiet, uninterrupted
                environment before beginning.
              </p>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-black text-white py-4 px-6 text-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Maximize className="w-5 h-5" />
            Enter Proctor Mode & Begin Assessment
          </button>
        </motion.div>
      </div>
    );
  }

  // Progress calculation
  const moduleProgress = {
    math: 33,
    incident: 66,
    architecture: 100,
  };

  const progress = moduleProgress[currentModule];
  const timeProgress = (timeRemaining / (45 * 60)) * 100;

  return (
    <div className="h-screen bg-white text-black overflow-hidden flex flex-col">
      {/* Timer Bar */}
      <div className="bg-gray-100 border-b border-gray-300">
        <div className="flex items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-mono font-semibold">
              MODULE {currentModule === 'math' ? '1' : currentModule === 'incident' ? '2' : '3'}
            </span>
            <span className="text-gray-500">
              {currentModule === 'math' && 'Mathematical Intuition'}
              {currentModule === 'incident' && 'Production Incident Analysis'}
              {currentModule === 'architecture' && 'Architectural Decision Making'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className={`font-mono font-semibold ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-300 h-1">
          <div
            className={`h-full transition-all duration-300 ${timeRemaining < 300 ? 'bg-red-600' : 'bg-black'}`}
            style={{ width: `${timeProgress}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentModule === 'math' && (
            <MathModule
              key="math"
              answer={answers.math}
              onAnswer={(value) => updateAnswer('math', value)}
              onNext={handleNextModule}
            />
          )}
          {currentModule === 'incident' && (
            <IncidentModule
              key="incident"
              selectedLine={selectedCodeLine}
              onSelectLine={(line) => {
                setSelectedCodeLine(line);
                updateAnswer('incidentLine', line);
              }}
              onNext={handleNextModule}
            />
          )}
          {currentModule === 'architecture' && (
            <ArchitectureModule
              key="architecture"
              answer={answers.architecture || ''}
              onAnswer={(value) => updateAnswer('architecture', value)}
              onSubmit={handleSubmit}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Module 1: Math
function MathModule({
  answer,
  onAnswer,
  onNext,
}: {
  answer?: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-2 h-full"
    >
      {/* Left: Scenario */}
      <div className="border-r border-gray-300 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Module 1: Mathematical Intuition for AI</h2>
        <div className="prose prose-sm max-w-none">
          <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
            <h3 className="text-sm font-semibold mb-3">Scenario</h3>
            <p className="text-sm mb-4">
              You are training a <strong>fraud detection model</strong>. Your dataset contains:
            </p>
            <ul className="text-sm space-y-1 mb-4">
              <li>99.9% legitimate transactions</li>
              <li>0.1% fraudulent transactions</li>
            </ul>
            <p className="text-sm">
              After training, your model achieves <strong>99.9% accuracy</strong>.
            </p>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <h3 className="text-sm font-semibold mb-3">Question</h3>
            <p className="text-sm font-medium">
              Why is this model useless in production? Explain in terms of Precision and Recall.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Answer */}
      <div className="p-8 flex flex-col">
        <h3 className="text-lg font-semibold mb-6">Select Your Answer</h3>
        <div className="space-y-3 flex-1">
          {[
            { id: 'A', text: 'The model is overfitted to the training data.' },
            {
              id: 'B',
              text: 'The accuracy metric is misleading due to class imbalance; Recall is near 0.',
            },
            { id: 'C', text: 'The learning rate was too high during training.' },
            { id: 'D', text: 'The model needs more epochs to converge properly.' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className={`w-full text-left p-4 border-2 transition-colors ${
                answer === option.id
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="font-semibold mr-3">{option.id}.</span>
              <span className="text-sm">{option.text}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onNext}
          disabled={!answer}
          className="w-full bg-black text-white py-3 px-6 font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
        >
          Continue to Module 2
        </button>
      </div>
    </motion.div>
  );
}

// Module 2: Incident
function IncidentModule({
  selectedLine,
  onSelectLine,
  onNext,
}: {
  selectedLine: number | null;
  onSelectLine: (line: number) => void;
  onNext: () => void;
}) {
  const codeLines = [
    'def process_checkout(user_id, cart):',
    '    db = get_db_connection()',
    '    try:',
    '        if check_inventory(cart):',
    '            charge_user(user_id)',
    '            # CRITICAL ERROR: Connection not closed',
    '            return "Success"',
    '    except Exception as e:',
    '        log_error(e)',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-2 h-full"
    >
      {/* Left: Scenario */}
      <div className="border-r border-gray-300 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Module 2: Production Incident Analysis</h2>
        
        <div className="bg-red-50 border border-red-300 p-4 mb-6">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Active Incident: Black Friday Checkout Failure
          </h3>
          <p className="text-sm">
            <strong>Severity:</strong> P0 (Production Down)
            <br />
            <strong>Impact:</strong> 30% of checkout requests failing with 500 errors
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-300 p-4">
            <h4 className="text-xs font-semibold mb-2">SERVER LOGS</h4>
            <pre className="text-xs font-mono text-red-600">
              Error: Connection pool exhausted.
              {'\n'}Max pool size (100) reached.
              {'\n'}Waiting for available connection...
            </pre>
          </div>

          <div className="bg-gray-50 border border-gray-300 p-4">
            <h4 className="text-xs font-semibold mb-3">LATENCY GRAPH</h4>
            <svg viewBox="0 0 300 100" className="w-full h-24">
              <polyline
                points="0,80 50,75 100,70 150,65 200,15 250,10 300,8"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />
              <line x1="0" y1="90" x2="300" y2="90" stroke="#999" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4" />
              <text x="205" y="50" fontSize="10" fill="#666">
                ← Spike
              </text>
            </svg>
            <p className="text-xs text-gray-600 mt-2">Database write latency (ms)</p>
          </div>
        </div>
      </div>

      {/* Right: Code Analysis */}
      <div className="p-8 flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Identify the Root Cause</h3>
        <p className="text-sm text-gray-600 mb-6">
          Click on the line that contains the critical error causing the connection pool exhaustion.
        </p>

        <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm flex-1 overflow-y-auto">
          {codeLines.map((line, index) => (
            <button
              key={index}
              onClick={() => onSelectLine(index + 1)}
              className={`block w-full text-left px-2 py-1 hover:bg-gray-800 transition-colors ${
                selectedLine === index + 1 ? 'bg-yellow-600 text-black' : ''
              }`}
            >
              <span className="text-gray-500 mr-4">{index + 1}</span>
              {line}
            </button>
          ))}
        </div>

        {selectedLine && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-300 text-sm">
            <strong>Selected:</strong> Line {selectedLine}
          </div>
        )}

        <button
          onClick={onNext}
          disabled={!selectedLine}
          className="w-full bg-black text-white py-3 px-6 font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
        >
          Continue to Module 3
        </button>
      </div>
    </motion.div>
  );
}

// Module 3: Architecture
function ArchitectureModule({
  answer,
  onAnswer,
  onSubmit,
}: {
  answer: string;
  onAnswer: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-2 h-full"
    >
      {/* Left: Scenario */}
      <div className="border-r border-gray-300 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Module 3: Architectural Decision Making</h2>
        
        <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
          <h3 className="text-sm font-semibold mb-3">System Design Challenge</h3>
          <p className="text-sm mb-4">
            You are designing the backend for a <strong>real-time ride-sharing application</strong>{' '}
            (similar to Uber).
          </p>
          <p className="text-sm mb-4">
            <strong>Requirements:</strong>
          </p>
          <ul className="text-sm space-y-2">
            <li>• Store live location of 100,000+ active drivers</li>
            <li>• Each driver's location updates every 3 seconds</li>
            <li>• Support geospatial queries (find drivers within 5km radius)</li>
            <li>• Data only needs to be retained for the active session</li>
            <li>• Query latency must be {'<'}50ms for rider matching</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-300 p-6">
          <h3 className="text-sm font-semibold mb-3">Question</h3>
          <p className="text-sm font-medium">
            Which database architecture would you choose and why? Explain your reasoning including
            trade-offs considered.
          </p>
        </div>
      </div>

      {/* Right: Answer */}
      <div className="p-8 flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Your Solution</h3>
        <p className="text-sm text-gray-600 mb-6">
          Provide a detailed architectural recommendation. Include specific technologies and justify
          your decision.
        </p>

        <textarea
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Example: I would use Redis with geospatial indexing because..."
          className="flex-1 w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none font-mono text-sm resize-none"
        />

        <div className="mt-4 text-xs text-gray-500">
          <p>Evaluation criteria:</p>
          <ul className="mt-2 space-y-1">
            <li>• Appropriate technology selection for write-heavy workloads</li>
            <li>• Understanding of in-memory vs disk-based storage</li>
            <li>• Recognition of ephemeral data patterns</li>
            <li>• Latency considerations for real-time systems</li>
          </ul>
        </div>

        <button
          onClick={onSubmit}
          disabled={answer.length < 50}
          className="w-full bg-black text-white py-3 px-6 font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
        >
          Submit Assessment
        </button>
      </div>
    </motion.div>
  );
}
