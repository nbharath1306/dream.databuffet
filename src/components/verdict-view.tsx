"use client";

import { motion } from "framer-motion";
import { useApplicationStore } from "@/store/application-store";
import {
  ArrowRight,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VerdictViewProps {
  className?: string;
  paymentLink?: string;
}

export function VerdictView({
  className,
  paymentLink = "https://buy.stripe.com/your-payment-link", // Replace with actual Stripe link
}: VerdictViewProps) {
  const { verdict, formData, resetForm } = useApplicationStore();

  if (!verdict) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-emerald-400";
      case "medium":
        return "text-amber-400";
      case "high":
        return "text-red-400";
      default:
        return "text-white/60";
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 border-amber-500/20";
      case "high":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  const discountPercent = Math.round(
    ((verdict.basePrice - verdict.finalPrice) / verdict.basePrice) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn("min-h-screen bg-black text-white py-12 px-4", className)}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Analysis Complete
            </span>
          </div>

          <h1 className="font-mono text-2xl md:text-4xl font-bold tracking-tight mb-2">
            CANDIDATE ANALYSIS REPORT
          </h1>

          <p className="text-white/40 font-mono text-sm">
            ID: {formData.email.split("@")[0].toUpperCase()}-
            {Date.now().toString(36).toUpperCase()}
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Diagnosis Card */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-white/40">
                Primary Diagnosis
              </h2>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {verdict.diagnosis}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {verdict.diagnosisDetail}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/30 font-mono">
              <span>Detected from:</span>
              <span className="text-white/50">
                {formData.failureReason || "application data"}
              </span>
            </div>
          </motion.div>

          {/* Success Probability Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.02] border border-white/[0.08] rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-white/40">
                Success Probability
              </h2>
            </div>

            <div className="flex items-end gap-4 mb-4">
              <span className="text-5xl font-mono font-bold text-white">
                {verdict.successProbability}%
              </span>
              <span
                className={cn(
                  "text-sm font-mono uppercase mb-2",
                  getRiskColor(verdict.riskLevel)
                )}
              >
                {verdict.riskLevel} risk
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${verdict.successProbability}%` }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Curriculum", value: "Customized" },
                { label: "Support", value: "24/7" },
                { label: "Placement", value: "Guaranteed" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/[0.03] rounded px-2 py-1.5"
                >
                  <div className="text-[10px] text-white/30 uppercase">
                    {item.label}
                  </div>
                  <div className="text-xs text-white/70 font-medium">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pricing Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.08] rounded-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-white/40" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-white/40">
                  Your Investment
                </h2>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl md:text-5xl font-mono font-bold text-white">
                  ${verdict.finalPrice.toLocaleString()}
                </span>
                {verdict.grantApplied && (
                  <span className="text-lg text-white/30 line-through">
                    ${verdict.basePrice.toLocaleString()}
                  </span>
                )}
              </div>

              {verdict.grantApplied && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400 font-mono">
                    <CheckCircle className="w-3 h-3" />
                    {verdict.grantType}
                  </span>
                  <span className="text-xs text-white/40">
                    You save ${(verdict.basePrice - verdict.finalPrice).toLocaleString()} ({discountPercent}% off)
                  </span>
                </div>
              )}

              <p className="text-sm text-white/40 mt-3">
                {verdict.cohortName} • Starts immediately upon enrollment
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: Shield, text: "Pay after placement" },
                { icon: Zap, text: "1:1 mentorship" },
                { icon: Clock, text: "12-week program" },
                { icon: Lock, text: "Lifetime access" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-white/60">
                  <feature.icon className="w-4 h-4 text-white/30" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className={cn(
                "w-full md:w-auto min-w-[300px] h-16 text-lg font-mono uppercase tracking-wider",
                "bg-white text-black hover:bg-white/90",
                "relative overflow-hidden group"
              )}
            >
              {/* Pulse effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <span className="relative flex items-center gap-3">
                <span>Initiate Enrollment</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </a>

          {/* Urgency & trust */}
          <div className="mt-6 space-y-2">
            <p className="text-sm text-amber-400/80 font-mono">
              ⚡ This pricing is locked for 24 hours
            </p>
            <p className="text-xs text-white/30">
              🔒 256-bit encryption • Secure checkout powered by Stripe
            </p>
          </div>
        </motion.div>

        {/* Candidate Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 border-t border-white/[0.05] pt-8"
        >
          <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-4">
            Application Summary
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/[0.02] rounded-lg p-3">
              <div className="text-[10px] text-white/30 uppercase mb-1">
                Candidate
              </div>
              <div className="text-white/70 truncate">{formData.name}</div>
            </div>
            <div className="bg-white/[0.02] rounded-lg p-3">
              <div className="text-[10px] text-white/30 uppercase mb-1">
                Location
              </div>
              <div className="text-white/70 truncate">
                {formData.location || "Not specified"}
              </div>
            </div>
            <div className="bg-white/[0.02] rounded-lg p-3">
              <div className="text-[10px] text-white/30 uppercase mb-1">
                Status
              </div>
              <div className="text-white/70 capitalize">
                {formData.currentSituation?.replace("-", " ") || "Not specified"}
              </div>
            </div>
            <div className="bg-white/[0.02] rounded-lg p-3">
              <div className="text-[10px] text-white/30 uppercase mb-1">
                Academic
              </div>
              <div className="text-white/70">
                {formData.cgpa ? `CGPA: ${formData.cgpa}` : "Not specified"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reset link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-8"
        >
          <button
            onClick={resetForm}
            className="text-xs text-white/30 hover:text-white/50 transition-colors underline underline-offset-4"
          >
            Not you? Start a new application
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
