'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

interface GapAnalysisReportProps {
  score: number;
  answers: {
    math?: string;
    incidentLine?: number;
    architecture?: string;
  };
}

export function GapAnalysisReport({ score, answers }: GapAnalysisReportProps) {
  const router = useRouter();

  // Calculate individual module scores
  const mathScore = answers.math === 'B' ? 30 : 0;
  const incidentScore = answers.incidentLine === 5 || answers.incidentLine === 6 ? 40 : 0;
  const archScore = (() => {
    const archAnswer = (answers.architecture || '').toLowerCase();
    if (
      archAnswer.includes('redis') ||
      archAnswer.includes('in-memory') ||
      archAnswer.includes('in memory')
    ) {
      return 30;
    }
    return 0;
  })();

  const candidateId = `#${Math.floor(Math.random() * 90000) + 10000}`;
  const passed = score >= 90;

  const getPercentile = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'Top 20%';
    if (percentage >= 50) return 'Top 50%';
    if (percentage >= 20) return 'Bottom 50%';
    return 'Bottom 10%';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white text-black p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-black pb-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Engineering Evaluation Report</h1>
              <p className="text-sm text-gray-600">The Protocol Assessment Results</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Candidate ID</p>
              <p className="text-lg font-mono font-bold">{candidateId}</p>
            </div>
          </div>
        </div>

        {/* Result Status */}
        <div className={`p-6 mb-8 border-2 ${passed ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className={`w-6 h-6 ${passed ? 'text-green-600' : 'text-red-600'}`} />
            <h2 className="text-xl font-bold">
              {passed ? 'QUALIFIED' : 'NOT QUALIFIED FOR DIRECT PLACEMENT'}
            </h2>
          </div>
          <p className="text-sm">
            <span className="font-semibold">Role Eligibility:</span>{' '}
            {passed ? 'L3+ (Mid-Senior Engineer)' : 'L1 (Intern)'}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Market Readiness:</span>{' '}
            {passed ? 'DEPLOYABLE' : 'NOT DEPLOYABLE'}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Performance Analysis</h3>
          
          {/* Overall Score */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-300">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Overall Score</span>
              <span className="text-2xl font-bold">{score}/100</span>
            </div>
            <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${score >= 90 ? 'bg-green-600' : 'bg-red-600'}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Module 1: Math Intuition */}
          <div className="mb-4 p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">Mathematical Intuition for AI</h4>
                <p className="text-xs text-gray-600">
                  Percentile: {getPercentile(mathScore, 30)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{mathScore}/30</span>
                {mathScore >= 24 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 inline ml-2" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 inline ml-2" />
                )}
              </div>
            </div>
            {mathScore < 30 && (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ You failed to identify the class imbalance problem. In production, high accuracy
                with imbalanced data is misleading.
              </p>
            )}
          </div>

          {/* Module 2: Production Incident */}
          <div className="mb-4 p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">System Design & Production Awareness</h4>
                <p className="text-xs text-gray-600">
                  Percentile: {getPercentile(incidentScore, 40)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{incidentScore}/40</span>
                {incidentScore >= 32 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 inline ml-2" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 inline ml-2" />
                )}
              </div>
            </div>
            {incidentScore < 40 && (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Critical Failure: You failed to identify the resource leak (connection pool exhaustion).
                In production, this would crash the server under load.
              </p>
            )}
          </div>

          {/* Module 3: Architecture */}
          <div className="mb-4 p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">Architectural Decision Making</h4>
                <p className="text-xs text-gray-600">
                  Percentile: {getPercentile(archScore, 30)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{archScore}/30</span>
                {archScore >= 24 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 inline ml-2" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 inline ml-2" />
                )}
              </div>
            </div>
            {archScore < 30 && (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ You chose a sub-optimal solution for high-velocity writes. Real-time geolocation
                requires in-memory storage with TTL, not traditional databases.
              </p>
            )}
          </div>
        </div>

        {/* Remediation Plan */}
        {!passed && (
          <div className="border-t-2 border-black pt-6">
            <h3 className="text-lg font-bold mb-4">Remediation Plan</h3>
            <div className="bg-blue-50 border border-blue-300 p-6">
              <p className="text-sm mb-4">
                You have strong {mathScore >= 20 ? 'mathematical' : 'foundational'} potential, but
                you lack <span className="font-bold">"Production Awareness"</span>. In the real
                world, your code would have {incidentScore === 0 ? 'crashed the server' : 'caused performance issues'}.
              </p>
              <p className="text-sm mb-4">
                The <span className="font-bold">Data Buffet Cohort</span> is designed to bridge
                this specific gap. We don't teach syntax. We teach{' '}
                <span className="font-bold">System Architecture and Production Engineering</span>.
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-black text-white py-3 px-6 text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Join Batch 12 to Fix Your System Design Score
              </button>
            </div>
          </div>
        )}

        {passed && (
          <div className="border-t-2 border-black pt-6">
            <div className="bg-green-50 border border-green-300 p-6">
              <p className="text-sm mb-4">
                <span className="font-bold">Congratulations.</span> You have demonstrated
                production-grade engineering thinking. You are market-ready.
              </p>
              <button
                onClick={() => router.push('/apply')}
                className="w-full bg-green-600 text-white py-3 px-6 text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Apply for Direct Placement
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Data Buffet Engineering Evaluation © 2026</p>
          <p>This assessment measures production engineering capability, not memorization.</p>
        </div>
      </div>
    </motion.div>
  );
}
