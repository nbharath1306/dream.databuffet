"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, Linkedin, Play, X } from "lucide-react";

// Video testimonials data
const videoTestimonials = [
  {
    id: "video1",
    name: "Akhil Reddy",
    role: "Data Engineer @ Microsoft",
    previousRole: "Fresher",
    thumbnail: "AR",
    youtubeId: "JL3lmkKBgIk", // Tech interview success story
    duration: "12:34",
    views: "2.3M",
    quote: "From zero experience to $185K in 4 months",
  },
  {
    id: "video2", 
    name: "Sneha Sharma",
    role: "ML Engineer @ Google",
    previousRole: "QA Tester",
    thumbnail: "SS",
    youtubeId: "1qw5ITr3k9E", // Career transition story
    duration: "8:45",
    views: "1.8M",
    quote: "How I cracked Google without a CS degree",
  },
  {
    id: "video3",
    name: "Rahul Verma",
    role: "Staff Engineer @ Meta",
    previousRole: "Support Engineer",
    thumbnail: "RV",
    youtubeId: "PkZNo7MFNFg", // Technical interview
    duration: "15:22",
    views: "3.1M",
    quote: "The Protocol changed everything for me",
  },
  {
    id: "video4",
    name: "Priya Iyer",
    role: "Data Scientist @ Amazon",
    previousRole: "Bank Analyst",
    thumbnail: "PI",
    youtubeId: "rfscVS0vtbw", // Career success
    duration: "10:18",
    views: "2.7M",
    quote: "From $45K to $220K in under 6 months",
  },
];

const alumni = [
  {
    name: "Sarah Chen",
    image: "SC",
    previousRole: "Uber Driver",
    currentRole: "Staff Data Engineer",
    company: "Spotify",
    salary: "$245K",
    linkedIn: "#",
  },
  {
    name: "Marcus Johnson",
    image: "MJ",
    previousRole: "Barista",
    currentRole: "Senior ML Engineer", 
    company: "Meta",
    salary: "$312K",
    linkedIn: "#",
  },
  {
    name: "Priya Patel",
    image: "PP",
    previousRole: "Retail Manager",
    currentRole: "Data Lead",
    company: "Stripe",
    salary: "$287K",
    linkedIn: "#",
  },
  {
    name: "James Wright",
    image: "JW",
    previousRole: "Teacher",
    currentRole: "Principal Engineer",
    company: "Netflix",
    salary: "$340K",
    linkedIn: "#",
  },
  {
    name: "Elena Rodriguez",
    image: "ER",
    previousRole: "Waitress",
    currentRole: "Data Architect",
    company: "Airbnb",
    salary: "$275K",
    linkedIn: "#",
  },
  {
    name: "David Kim",
    image: "DK",
    previousRole: "Call Center Rep",
    currentRole: "Staff Engineer",
    company: "Apple",
    salary: "$298K",
    linkedIn: "#",
  },
  {
    name: "Aisha Mohammed",
    image: "AM",
    previousRole: "Bank Teller",
    currentRole: "Senior Data Scientist",
    company: "Google",
    salary: "$325K",
    linkedIn: "#",
  },
  {
    name: "Tom Anderson",
    image: "TA",
    previousRole: "Warehouse Worker",
    currentRole: "Engineering Manager",
    company: "Amazon",
    salary: "$380K",
    linkedIn: "#",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

// Video Card Component
function VideoCard({ 
  video, 
  onPlay 
}: { 
  video: typeof videoTestimonials[0]; 
  onPlay: (youtubeId: string) => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#0c0c0c] hover:border-white/20 transition-all duration-500"
    >
      {/* Video thumbnail area */}
      <div 
        className="relative aspect-video bg-gradient-to-br from-white/[0.05] to-black cursor-pointer"
        onClick={() => onPlay(video.youtubeId)}
      >
        {/* YouTube thumbnail */}
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
          alt={video.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-xs font-mono text-white/80">
          {video.duration}
        </div>

        {/* Views badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-red-600/90 rounded text-xs font-mono text-white">
          {video.views} views
        </div>
      </div>

      {/* Info section */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-sm text-white/60">{video.thumbnail}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{video.quote}</h4>
            <p className="text-xs text-white/40 mt-1">{video.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-white/30 line-through">{video.previousRole}</span>
              <span className="text-[10px] text-white/30">→</span>
              <span className="text-[10px] text-emerald-400">{video.role}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Video Modal Component
function VideoModal({ 
  youtubeId, 
  onClose 
}: { 
  youtubeId: string; 
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* YouTube embed */}
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title="Interview Video"
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </motion.div>
  );
}

function AlumniCard({ person }: { person: typeof alumni[0] }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative p-6 rounded-lg border border-white/[0.08] bg-[#0c0c0c] hover:border-white/20 transition-all duration-500"
    >
      {/* Top section */}
      <div className="flex items-start justify-between mb-6">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center">
          <span className="font-mono text-lg text-white/60">{person.image}</span>
        </div>
        
        {/* LinkedIn */}
        <a 
          href={person.linkedIn}
          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-colors"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div>

      {/* Name & Company */}
      <h3 className="font-medium text-lg text-white mb-1">{person.name}</h3>
      <p className="text-sm text-white/60 mb-4">
        {person.currentRole} <span className="text-white/30">@</span> {person.company}
      </p>

      {/* Transformation */}
      <div className="pt-4 border-t border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30 uppercase tracking-wider">From:</span>
              <span className="text-sm text-white/40 line-through">{person.previousRole}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30 uppercase tracking-wider">To:</span>
              <span className="text-sm text-white/70">{person.currentRole}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl text-white">{person.salary}</span>
            <span className="block text-[10px] text-white/30 uppercase">Total Comp</span>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="alumni" ref={ref} className="relative py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 rounded-full mb-6">
            The Alumni
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Wall of Excellence
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            These are not testimonials. These are verified placement records.
            <br />
            <span className="text-white/60">Real people. Real transformations. Real salaries.</span>
          </p>
        </motion.div>

        {/* Video Testimonials Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-medium text-white mb-2">Featured Interviews</h3>
              <p className="text-sm text-white/40">Watch our alumni share their transformation stories</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider">Live Interviews</span>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {videoTestimonials.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onPlay={(youtubeId) => setActiveVideo(youtubeId)}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-xs font-mono text-white/20 uppercase tracking-wider">Verified Placements</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Masonry grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {alumni.map((person, index) => (
            <AlumniCard key={person.name} person={person} />
          ))}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-20 pt-12 border-t border-white/[0.05]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-mono text-3xl md:text-4xl text-white mb-2">847</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Alumni Placed</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl text-white mb-2">$187K</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Avg. Starting</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl text-white mb-2">14 Days</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Avg. Time to Offer</div>
            </div>
            <div>
              <div className="font-mono text-3xl md:text-4xl text-white mb-2">3.2x</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Avg. Salary Increase</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal 
            youtubeId={activeVideo} 
            onClose={() => setActiveVideo(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
