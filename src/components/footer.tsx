"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <span className="font-serif text-xl text-white">Data Buffet</span>
              <span className="block text-[10px] text-white/30 uppercase tracking-widest">The Protocol</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
              Curriculum
            </a>
            <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
              Alumni
            </a>
            <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Legal */}
          <div className="text-xs text-white/20 font-mono">
            © 2026 Data Buffet. All rights reserved.
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-16 pt-8 border-t border-white/[0.03] text-center">
          <p className="text-white/10 text-sm font-mono">
            "We don't lower the bar. We raise the candidate."
          </p>
        </div>
      </div>
    </footer>
  );
}
