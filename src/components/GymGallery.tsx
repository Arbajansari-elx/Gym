import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  Pause,
  Play,
  Grid,
  Sparkles,
  Layers,
  CheckCircle2,
  Calendar,
  Share2
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";

export interface GalleryPhoto {
  id: string;
  title: string;
  desc: string;
  category: "Free Weights" | "Interiors" | "Powerlifting" | "Power Racks" | "Bodybuilding" | "Chest & Benches" | "Personal Training" | "Functional Turf" | "Cardio Zone" | "Cable Rigs" | "Leg Arena" | "Athletic Drills";
  filterGroup: "Free Weights & Racks" | "Interiors & Machines" | "Cardio & Turf" | "Coaching & Bodybuilding";
  fullUrl: string;
  mediumUrl: string;
  thumbUrl: string;
  specs: string;
}

export const GYM_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "g1",
    title: "Heavy Iron Dumbbell & Free-Weight Bay",
    desc: "Complete pairs of solid steel and urethane hex dumbbells ranging from 2.5 kg up to 50 kg, racked on dual commercial grade saddles.",
    category: "Free Weights",
    filterGroup: "Free Weights & Racks",
    fullUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=360&q=75",
    specs: "Up to 50 kg pairs • Dual commercial saddles • Anti-slip grip",
  },
  {
    id: "g2",
    title: "Main Strength & Conditioning Arena",
    desc: "Spacious, high-ceiling athletic training floor with dedicated power bays, modern atmospheric lighting, and high-density shock-absorbing rubber flooring.",
    category: "Interiors",
    filterGroup: "Interiors & Machines",
    fullUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=360&q=75",
    specs: "Shock-absorbing flooring • Open layout • Industrial climate control",
  },
  {
    id: "g3",
    title: "Olympic Barbell & Deadlift Platform",
    desc: "Calibrated 20kg Olympic barbells, high-impact competition rubber bumper plates, chalk basins, and hardwood drop zones built for heavy deadlifts.",
    category: "Powerlifting",
    filterGroup: "Free Weights & Racks",
    fullUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=360&q=75",
    specs: "20kg Olympic bars • Rubber bumper plates • Hardwood drop platforms",
  },
  {
    id: "g4",
    title: "Commercial Power Racks & Squat Cage Bay",
    desc: "Heavy-gauge steel modular power cages equipped with adjustable safety spotter pins, multi-angle pull-up handles, and resistance band pegs.",
    category: "Power Racks",
    filterGroup: "Free Weights & Racks",
    fullUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=360&q=75",
    specs: "Heavy 3x3 steel tube cages • Safety pins • Multi-grip pull-up handles",
  },
  {
    id: "g5",
    title: "Bodybuilding & Muscle Hypertrophy Zone",
    desc: "Dedicated isolation zone with pre-exhaust benches, EZ-curl stations, and heavy arm blasters for targeted peak muscular contraction and hypertrophy.",
    category: "Bodybuilding",
    filterGroup: "Coaching & Bodybuilding",
    fullUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=360&q=75",
    specs: "Full range bicep/tricep isolation • Arm blaster • EZ curl bars",
  },
  {
    id: "g6",
    title: "Olympic Competition Bench Press Stations",
    desc: "Solid steel flat and incline bench stations with high-density anti-skid upholstery, multiple bar rests, and spotter footplates.",
    category: "Chest & Benches",
    filterGroup: "Interiors & Machines",
    fullUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=360&q=75",
    specs: "High-density foam • Anti-skid grip pad • Spotter footplates",
  },
  {
    id: "g7",
    title: "1-on-1 Certified Personal Trainer Coaching",
    desc: "Individualized biomechanics coaching, posture corrections, and progressive overload tracking supervised by Head Coach Aditya and certified trainers.",
    category: "Personal Training",
    filterGroup: "Coaching & Bodybuilding",
    fullUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=360&q=75",
    specs: "Direct coach oversight • Biomechanical form feedback • Program progression",
  },
  {
    id: "g8",
    title: "Functional Turf & Battle Ropes Conditioning",
    desc: "High-density sprint turf track featuring heavy 50-foot nylon battle ropes, weighted prowler sleds, and plyometric jump boxes.",
    category: "Functional Turf",
    filterGroup: "Cardio & Turf",
    fullUrl: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=360&q=75",
    specs: "Sprint turf track • 50ft thick battle ropes • Heavy push sled",
  },
  {
    id: "g9",
    title: "Cardio & Endurance Treadmill Deck",
    desc: "Commercial-grade shock-cushioned treadmills, spin bikes, and rowers with real-time heart rate and wattage telemetry displays.",
    category: "Cardio Zone",
    filterGroup: "Cardio & Turf",
    fullUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=360&q=75",
    specs: "Shock-cushioned decks • Real-time metrics • Airflow cooling fans",
  },
  {
    id: "g10",
    title: "Dual Adjustable Cable Crossover Tower",
    desc: "Multi-station dual pulley system with 2:1 ratio smooth bearings, multiple handle attachments, and precision pin-selector stacks.",
    category: "Cable Rigs",
    filterGroup: "Interiors & Machines",
    fullUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=360&q=75",
    specs: "Smooth bearing cable pulleys • Wide handle attachments • Bilateral tracks",
  },
  {
    id: "g11",
    title: "45-Degree Leg Press & Heavy Plate Machinery",
    desc: "Commercial plate-loaded linear leg press and hack squat machine with dual safety locking mechanisms for heavy lower-body overload.",
    category: "Leg Arena",
    filterGroup: "Interiors & Machines",
    fullUrl: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=360&q=75",
    specs: "45-degree angle • 500kg plate capacity • Ergonomic back support",
  },
  {
    id: "g12",
    title: "High-Intensity Athletic Training & Group Drills",
    desc: "Dynamic athletic conditioning, kettlebell circuits, and athletic agility drills building endurance, stamina, and camaraderie.",
    category: "Athletic Drills",
    filterGroup: "Cardio & Turf",
    fullUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=85",
    mediumUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=360&q=75",
    specs: "Competition kettlebells • Agility ladders • High-energy environment",
  },
];

type FilterCategory = "All" | "Free Weights & Racks" | "Interiors & Machines" | "Cardio & Turf" | "Coaching & Bodybuilding";

export const GymGallery: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"spotlight" | "grid">("spotlight");
  const [imageLoadedMap, setImageLoadedMap] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Filtered photos
  const filteredPhotos = selectedFilter === "All"
    ? GYM_GALLERY_PHOTOS
    : GYM_GALLERY_PHOTOS.filter((photo) => photo.filterGroup === selectedFilter);

  // Keep index within filtered bounds
  useEffect(() => {
    if (currentIndex >= filteredPhotos.length) {
      setCurrentIndex(0);
    }
  }, [selectedFilter, filteredPhotos.length, currentIndex]);

  // Autoplay rotation in spotlight mode
  useEffect(() => {
    if (isAutoPlaying && viewMode === "spotlight" && filteredPhotos.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length);
      }, 4200);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, viewMode, filteredPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev === null || prev === 0 ? filteredPhotos.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % filteredPhotos.length));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handleImageLoad = (id: string) => {
    setImageLoadedMap((prev) => ({ ...prev, [id]: true }));
  };

  const currentPhoto = filteredPhotos[currentIndex] || GYM_GALLERY_PHOTOS[0];
  const activeLightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const handleCopyShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filterTabs: { id: FilterCategory; label: string; count: number }[] = [
    { id: "All", label: "All Photos", count: GYM_GALLERY_PHOTOS.length },
    {
      id: "Free Weights & Racks",
      label: "Free Weights & Racks",
      count: GYM_GALLERY_PHOTOS.filter((p) => p.filterGroup === "Free Weights & Racks").length,
    },
    {
      id: "Interiors & Machines",
      label: "Interiors & Machines",
      count: GYM_GALLERY_PHOTOS.filter((p) => p.filterGroup === "Interiors & Machines").length,
    },
    {
      id: "Cardio & Turf",
      label: "Cardio & Turf",
      count: GYM_GALLERY_PHOTOS.filter((p) => p.filterGroup === "Cardio & Turf").length,
    },
    {
      id: "Coaching & Bodybuilding",
      label: "Coaching & Physique",
      count: GYM_GALLERY_PHOTOS.filter((p) => p.filterGroup === "Coaching & Bodybuilding").length,
    },
  ];

  return (
    <section id="gallery" className="py-12 sm:py-16 bg-[#FAF7F2] relative text-[#191919]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 text-[#D95D0F] text-xs font-semibold tracking-widest uppercase">
              <Camera className="w-4 h-4" />
              <span>AUTHENTIC FACILITY TOUR</span>
            </div>
            <h2 className="font-athletic text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] uppercase">
              MAHADEV GYM <span className="text-[#D95D0F]">PREMIUM GALLERY</span>
            </h2>
            <p className="text-[#57534E] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Explore 12 real photographic views of our high-caliber gym floor — calibrated Olympic barbells, dumbbell racks up to 50kg, power cages, cardio bays, and coaching sessions.
            </p>
          </div>

          {/* View Mode & Autoplay Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-xl p-1 bg-[#FFFFFF] border border-[#E5DFD5] shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("spotlight")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "spotlight"
                    ? "bg-[#D95D0F] text-white shadow-xs"
                    : "text-[#57534E] hover:text-[#191919]"
                }`}
                title="Spotlight Slider View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Spotlight</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-[#D95D0F] text-white shadow-xs"
                    : "text-[#57534E] hover:text-[#191919]"
                }`}
                title="All Photos Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>All Grid</span>
              </button>
            </div>

            {/* Autoplay & Navigation for Spotlight mode */}
            {viewMode === "spotlight" && (
              <>
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5DFD5] text-[#57534E] hover:text-[#D95D0F] transition-colors cursor-pointer shadow-2xs"
                  title={isAutoPlaying ? "Pause Auto-Slide" : "Play Auto-Slide"}
                  aria-label={isAutoPlaying ? "Pause Auto-Slide" : "Play Auto-Slide"}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5DFD5] text-[#191919] hover:border-[#D95D0F] hover:text-[#D95D0F] transition-colors cursor-pointer shadow-2xs active:scale-95"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5DFD5] text-[#191919] hover:border-[#D95D0F] hover:text-[#D95D0F] transition-colors cursor-pointer shadow-2xs active:scale-95"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedFilter(tab.id);
                  setCurrentIndex(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-[#191919] text-white shadow-sm"
                    : "bg-[#FFFFFF] text-[#57534E] border border-[#E5DFD5] hover:border-[#D5CABE] hover:text-[#191919]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? "bg-[#D95D0F] text-white" : "bg-[#FAF7F2] text-[#78716C]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SPOTLIGHT VIEW */}
        {viewMode === "spotlight" && currentPhoto && (
          <div>
            <div
              className="relative rounded-3xl overflow-hidden border border-[#E8E2D8] bg-[#121212] shadow-[0_12px_40px_rgba(40,32,24,0.08)] mb-6 group"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Main Photo Frame */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-[#1C1C1C]">
                {/* Image Preloader Skeleton */}
                {!imageLoadedMap[currentPhoto.id] && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#202020] via-[#2A2A2A] to-[#202020] animate-pulse flex items-center justify-center">
                    <span className="text-xs uppercase tracking-widest text-[#777] font-semibold">Loading High-Res Photograph...</span>
                  </div>
                )}

                <img
                  src={currentPhoto.fullUrl}
                  alt={currentPhoto.title}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onLoad={() => handleImageLoad(currentPhoto.id)}
                  className={`w-full h-full object-cover object-center transition-all duration-700 ${
                    imageLoadedMap[currentPhoto.id] ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  } group-hover:scale-102`}
                />

                {/* Subtle vignette & bottom gradient for crisp text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

                {/* Top Corner Badge */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#D95D0F] px-3 py-1 rounded-full shadow-md backdrop-blur-md">
                    Photo {String(currentIndex + 1).padStart(2, "0")} / {String(filteredPhotos.length).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md hidden sm:inline-block">
                    {currentPhoto.category}
                  </span>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#FF8533] uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{currentPhoto.category} Equipment</span>
                    </div>
                    <h3 className="font-athletic text-2xl sm:text-4xl font-bold text-white uppercase tracking-tight">
                      {currentPhoto.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#F5F5F4]/90 mt-1.5 leading-relaxed max-w-2xl">
                      {currentPhoto.desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/80 bg-white/10 border border-white/15 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        <CheckCircle2 className="w-3 h-3 text-[#D95D0F]" />
                        {currentPhoto.specs}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(currentIndex)}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#191919] bg-[#FFFFFF] hover:bg-[#FAF7F2] rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#D95D0F]" />
                      <span>FULLSCREEN ENLARGE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Strip with Real Photos */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {filteredPhotos.map((photo, idx) => {
                const isSelected = currentIndex === idx;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative rounded-xl overflow-hidden border aspect-[4/3] p-0.5 text-left transition-all cursor-pointer group ${
                      isSelected
                        ? "border-[#D95D0F] ring-2 ring-[#D95D0F]/40 shadow-md scale-103 bg-[#FFFFFF]"
                        : "border-[#E8E2D8] bg-[#FAF7F2] opacity-75 hover:opacity-100 hover:border-[#D5CABE]"
                    }`}
                  >
                    <div className="w-full h-full relative rounded-lg overflow-hidden bg-[#1E1E1E]">
                      <img
                        src={photo.thumbUrl}
                        alt={photo.title}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-white drop-shadow-sm">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] font-semibold text-white/90 truncate max-w-[70px] drop-shadow-sm">
                          {photo.category}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* GRID VIEW (ALL PHOTOS AT A GLANCE) */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                {/* Photo Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#1C1C1C]">
                  <img
                    src={photo.mediumUrl}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#D95D0F] px-2.5 py-0.5 rounded-full shadow-xs">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-black/60 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
                      {photo.category}
                    </span>
                  </div>

                  {/* Click to Enlarge Overlay Button */}
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 cursor-pointer"
                    aria-label={`Enlarge ${photo.title}`}
                  >
                    <div className="px-3.5 py-2 rounded-xl bg-white text-[#191919] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5 text-[#D95D0F]" />
                      <span>View High-Res</span>
                    </div>
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-athletic text-lg font-bold text-[#191919] uppercase tracking-wide group-hover:text-[#D95D0F] transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed line-clamp-2">
                      {photo.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#ECE5DA] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#78716C]">
                      {photo.specs.split("•")[0]}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="text-xs font-bold text-[#D95D0F] hover:text-[#B84E0C] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Expand</span>
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Facility Booking Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D95D0F]/10 border border-[#D95D0F]/20 flex items-center justify-center text-[#D95D0F] shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-athletic text-xl font-bold text-[#191919] uppercase">
                EXPERIENCE THE REAL MAHADEV IRON FLOOR
              </h4>
              <p className="text-xs sm:text-sm text-[#57534E] mt-0.5">
                Schedule a 1-day free trial pass to test our Olympic platforms, heavy dumbbells, and coaching firsthand.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo("contact")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D95D0F] hover:bg-[#B84E0C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
          >
            BOOK FREE TRIAL VISIT
          </button>
        </div>
      </div>

      {/* LIGHTBOX MODAL WITH FULLSCREEN REAL PHOTOGRAPHY */}
      {lightboxIndex !== null && activeLightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-5xl bg-[#FFFFFF] border border-[#E5DFD5] rounded-3xl overflow-hidden shadow-2xl text-[#191919] flex flex-col max-h-[95vh]">
            {/* Lightbox Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#ECE5DA] bg-[#FAF7F2]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-white bg-[#D95D0F] px-2.5 py-1 rounded-md shadow-2xs">
                  {String(lightboxIndex + 1).padStart(2, "0")} / {String(filteredPhotos.length).padStart(2, "0")}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                    {activeLightboxPhoto.category} • Authentic Photograph
                  </span>
                  <h4 className="font-athletic text-base sm:text-lg font-bold text-[#191919] uppercase tracking-wide truncate max-w-sm sm:max-w-md">
                    {activeLightboxPhoto.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="p-2 text-[#78716C] hover:text-[#191919] bg-[#FFFFFF] hover:bg-[#EFE9DF] rounded-xl transition-colors border border-[#E5DFD5] cursor-pointer"
                  title="Copy Page Link"
                  aria-label="Share Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 text-[#78716C] hover:text-[#191919] bg-[#FFFFFF] hover:bg-[#EFE9DF] rounded-xl transition-colors border border-[#E5DFD5] cursor-pointer"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Main Image Canvas */}
            <div className="relative w-full bg-[#0E0E0E] flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[460px] flex-grow">
              <img
                src={activeLightboxPhoto.fullUrl}
                alt={activeLightboxPhoto.title}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-[62vh] w-auto max-w-full object-contain mx-auto transition-transform duration-300"
              />

              {/* Prev / Next Floaters inside image */}
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null || prev === 0 ? filteredPhotos.length - 1 : prev - 1
                  )
                }
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#D95D0F] transition-all cursor-pointer backdrop-blur-xs border border-white/20 active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null ? 0 : (prev + 1) % filteredPhotos.length
                  )
                }
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#D95D0F] transition-all cursor-pointer backdrop-blur-xs border border-white/20 active:scale-95"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Bottom Footer & Description */}
            <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#ECE5DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-2xl">
                  {activeLightboxPhoto.desc}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] font-semibold text-[#D95D0F] bg-[#D95D0F]/10 px-2 py-0.5 rounded-md">
                    {activeLightboxPhoto.specs}
                  </span>
                  {copiedLink && (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md animate-in fade-in">
                      Link copied to clipboard!
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Lightbox Action */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(null);
                    navigateTo("contact");
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#D95D0F] hover:bg-[#B84E0C] rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Visit This Arena
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
