"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, Linkedin, Play, X, ExternalLink, Youtube, Award, TrendingUp } from "lucide-react";

// Video testimonials data - 12 featured interviews
const videoTestimonials = [
  // Row 1 - Featured (larger cards)
  {
    id: "video1",
    name: "Akhil Reddy",
    role: "Data Engineer @ Microsoft",
    previousRole: "Fresher (0 YOE)",
    thumbnail: "AR",
    youtubeId: "JL3lmkKBgIk",
    duration: "12:34",
    views: "2.3M",
    quote: "From zero experience to $185K in 4 months",
    salary: "$185K",
    featured: true,
    country: "🇮🇳 India → 🇺🇸 USA",
  },
  {
    id: "video2", 
    name: "Sneha Sharma",
    role: "ML Engineer @ Google",
    previousRole: "QA Tester",
    thumbnail: "SS",
    youtubeId: "1qw5ITr3k9E",
    duration: "8:45",
    views: "1.8M",
    quote: "How I cracked Google without a CS degree",
    salary: "$245K",
    featured: true,
    country: "🇮🇳 India → 🇬🇧 London",
  },
  {
    id: "video3",
    name: "Rahul Verma",
    role: "Staff Engineer @ Meta",
    previousRole: "Support Engineer",
    thumbnail: "RV",
    youtubeId: "PkZNo7MFNFg",
    duration: "15:22",
    views: "3.1M",
    quote: "The Protocol changed everything for me",
    salary: "$312K",
    featured: true,
    country: "🇮🇳 India → 🇺🇸 Bay Area",
  },
  // Row 2
  {
    id: "video4",
    name: "Priya Iyer",
    role: "Data Scientist @ Amazon",
    previousRole: "Bank Analyst",
    thumbnail: "PI",
    youtubeId: "rfscVS0vtbw",
    duration: "10:18",
    views: "2.7M",
    quote: "From $45K to $220K in under 6 months",
    salary: "$220K",
    featured: false,
    country: "🇮🇳 Chennai → 🇩🇪 Berlin",
  },
  {
    id: "video5",
    name: "Karthik Menon",
    role: "Senior SDE @ Apple",
    previousRole: "Freelancer",
    thumbnail: "KM",
    youtubeId: "8jLOx1hD3_o",
    duration: "14:52",
    views: "1.5M",
    quote: "Freelancing to FAANG in 90 days",
    salary: "$275K",
    featured: false,
    country: "🇮🇳 Bangalore → 🇺🇸 Cupertino",
  },
  {
    id: "video6",
    name: "Anjali Deshmukh",
    role: "AI Engineer @ OpenAI",
    previousRole: "PhD Dropout",
    thumbnail: "AD",
    youtubeId: "x7X9w_GIm1s",
    duration: "18:30",
    views: "4.2M",
    quote: "Dropped out of PhD, landed OpenAI",
    salary: "$340K",
    featured: false,
    country: "🇮🇳 Mumbai → 🇺🇸 SF",
  },
  {
    id: "video7",
    name: "Vikram Singh",
    role: "Principal Engineer @ Netflix",
    previousRole: "TCS Developer",
    thumbnail: "VS",
    youtubeId: "hQAHSlTtcmY",
    duration: "11:45",
    views: "2.1M",
    quote: "Service company to FAANG leadership",
    salary: "$380K",
    featured: false,
    country: "🇮🇳 Pune → 🇺🇸 LA",
  },
  // Row 3
  {
    id: "video8",
    name: "Meera Krishnan",
    role: "Tech Lead @ Stripe",
    previousRole: "Startup Founder (Failed)",
    thumbnail: "MK",
    youtubeId: "vLnPwxZdW4Y",
    duration: "16:20",
    views: "1.9M",
    quote: "Failed startup to $350K tech lead",
    salary: "$350K",
    featured: false,
    country: "🇮🇳 Delhi → 🇺🇸 NYC",
  },
  {
    id: "video9",
    name: "Arjun Nair",
    role: "Staff ML @ Anthropic",
    previousRole: "Research Intern",
    thumbnail: "AN",
    youtubeId: "ZzWaow1Rvho",
    duration: "13:15",
    views: "3.5M",
    quote: "Intern to Staff in 2 years",
    salary: "$420K",
    featured: false,
    country: "🇮🇳 Kochi → 🇺🇸 SF",
  },
  {
    id: "video10",
    name: "Divya Rajan",
    role: "Engineering Manager @ Uber",
    previousRole: "Manual Tester",
    thumbnail: "DR",
    youtubeId: "W6NZfCO5SIk",
    duration: "9:48",
    views: "2.8M",
    quote: "From manual testing to managing 15 engineers",
    salary: "$295K",
    featured: false,
    country: "🇮🇳 Hyderabad → 🇳🇱 Amsterdam",
  },
  {
    id: "video11",
    name: "Sanjay Gupta",
    role: "Founding Engineer @ Figma",
    previousRole: "Bootcamp Grad",
    thumbnail: "SG",
    youtubeId: "hdI2bqOjy3c",
    duration: "20:05",
    views: "1.7M",
    quote: "Bootcamp to unicorn in 8 months",
    salary: "$265K + Equity",
    featured: false,
    country: "🇮🇳 Jaipur → 🇺🇸 SF",
  },
  {
    id: "video12",
    name: "Lakshmi Venkat",
    role: "Director of AI @ Coinbase",
    previousRole: "Laid Off (2x)",
    thumbnail: "LV",
    youtubeId: "q8d0t2rNXpo",
    duration: "17:33",
    views: "5.1M",
    quote: "Laid off twice, now Director level",
    salary: "$450K",
    featured: false,
    country: "🇮🇳 Chennai → 🇺🇸 Remote",
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
  onPlay,
  size = "normal"
}: { 
  video: typeof videoTestimonials[0]; 
  onPlay: (youtubeId: string) => void;
  size?: "normal" | "featured";
}) {
  const isFeatured = size === "featured" || video.featured;
  
  return (
    <motion.div
      variants={itemVariants}
      className={`group relative rounded-xl overflow-hidden border bg-[#0c0c0c] transition-all duration-500 ${
        isFeatured 
          ? "border-white/20 hover:border-white/40 ring-1 ring-white/5" 
          : "border-white/[0.08] hover:border-white/20"
      }`}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500/90 to-orange-500/90 rounded-full">
          <Award className="w-3 h-3 text-white" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Featured</span>
        </div>
      )}

      {/* Video thumbnail area */}
      <div 
        className={`relative bg-gradient-to-br from-white/[0.05] to-black cursor-pointer ${
          isFeatured ? "aspect-[16/10]" : "aspect-video"
        }`}
        onClick={() => onPlay(video.youtubeId)}
      >
        {/* YouTube thumbnail */}
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
          alt={video.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-full bg-red-600 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 shadow-2xl ${
            isFeatured ? "w-20 h-20" : "w-14 h-14"
          }`}>
            <Play className={`text-white fill-white ml-1 ${isFeatured ? "w-8 h-8" : "w-5 h-5"}`} />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/90 rounded text-xs font-mono text-white/90 backdrop-blur-sm">
          {video.duration}
        </div>

        {/* Views badge with YouTube icon */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-mono text-white/80">
          <Youtube className="w-3 h-3 text-red-500" />
          {video.views} views
        </div>
        
        {/* Salary overlay on hover */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/90 rounded">
            <TrendingUp className="w-3 h-3 text-white" />
            <span className="text-xs font-bold text-white">{video.salary}</span>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className={`${isFeatured ? "p-5" : "p-4"}`}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center flex-shrink-0 ${
            isFeatured ? "w-12 h-12" : "w-10 h-10"
          }`}>
            <span className={`font-mono text-white/70 ${isFeatured ? "text-base" : "text-sm"}`}>{video.thumbnail}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-white leading-tight ${isFeatured ? "text-base" : "text-sm"}`}>
              {video.quote}
            </h4>
            <p className="text-xs text-white/50 mt-1 font-medium">{video.name}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] text-white/40 line-through">{video.previousRole}</span>
              <span className="text-[10px] text-emerald-400">→</span>
              <span className="text-[10px] text-emerald-400 font-medium">{video.role}</span>
            </div>
            {video.country && (
              <div className="mt-2 text-[10px] text-white/30">
                {video.country}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient line for featured */}
      {isFeatured && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
      )}
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

          {/* Featured Videos - Top 3 */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {videoTestimonials.filter(v => v.featured).map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                size="featured"
                onPlay={(youtubeId) => setActiveVideo(youtubeId)}
              />
            ))}
          </motion.div>

          {/* All Other Videos - Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {videoTestimonials.filter(v => !v.featured).map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onPlay={(youtubeId) => setActiveVideo(youtubeId)}
              />
            ))}
          </motion.div>

          {/* Video stats */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] rounded-full border border-white/[0.05]">
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="text-sm text-white/60">32M+ Total Views</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] rounded-full border border-white/[0.05]">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-white/60">12 Featured Stories</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] rounded-full border border-white/[0.05]">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-white/60">Avg. $285K Salary</span>
            </div>
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
