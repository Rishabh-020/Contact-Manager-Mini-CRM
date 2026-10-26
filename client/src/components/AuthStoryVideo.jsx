// import React, { useRef, useState } from 'react';
// import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// // The video files live in client/public/videos/.
// const VIDEO_SRC = '/videos/contact-story.mp4';
// const POSTER_SRC = '/videos/contact-story-poster.jpg';

// export default function AuthStoryVideo() {
//   const videoRef = useRef(null);
//   const [playing, setPlaying] = useState(true);
//   const [muted, setMuted] = useState(true);
//   const [missing, setMissing] = useState(false);

//   const togglePlay = () => {
//     const video = videoRef.current;
//     if (!video) return;
//     if (video.paused) {
//       video.play();
//       setPlaying(true);
//     } else {
//       video.pause();
//       setPlaying(false);
//     }
//   };

//   const toggleMute = () => {
//     const video = videoRef.current;
//     if (!video) return;
//     video.muted = !video.muted;
//     setMuted(video.muted);
//   };

//   return (
//     <div className="rounded-3xl overflow-hidden bg-slate-900 shadow-2xl shadow-slate-400/40 border border-white">
//       {missing ? (
//         <div className="aspect-video flex items-center justify-center p-6 text-center text-sm text-slate-300">
//           Video not found. Put contact-story.mp4 in client/public/videos/
//         </div>
//       ) : (
//         <div className="relative group">
//           <video
//             ref={videoRef}
//             src={VIDEO_SRC}
//             poster={POSTER_SRC}
//             className="w-full aspect-video object-cover cursor-pointer"
//             autoPlay
//             muted
//             loop
//             playsInline
//             onClick={togglePlay}
//             onError={() => setMissing(true)}
//           />

//           {/* Controls: appear when you hover over the video */}
//           <div className="absolute bottom-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
//             <button
//               type="button"
//               onClick={togglePlay}
//               className="p-2 rounded-lg bg-black/55 hover:bg-black/75 text-white transition"
//               aria-label={playing ? 'Pause video' : 'Play video'}
//             >
//               {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//             </button>
//             <button
//               type="button"
//               onClick={toggleMute}
//               className="p-2 rounded-lg bg-black/55 hover:bg-black/75 text-white transition"
//               aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
//             >
//               {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="px-5 py-4 text-center">
//         <p className="text-sm font-semibold text-white">See how Mini-CRM organises your contacts</p>
//         <p className="text-xs text-slate-300 mt-0.5">Click the video to pause or play</p>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Sparkles } from "lucide-react";

// The video files live in client/public/videos/.
const VIDEO_SRC = "/videos/contact-story.mp4";
const POSTER_SRC = "/videos/contact-story-poster.jpg";

export default function AuthStoryVideo() {
  return (
    <div className="relative h-full min-h-screen bg-slate-900 overflow-hidden">
      {/* The full video, fitted to the panel. Its background matches bg-slate-900, so there are no visible edges. */}
      <video
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Brand at the top */}
      <div className="absolute top-0 left-0 right-0 p-8 flex items-center gap-2 text-white">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-sm font-semibold tracking-wide">Mini-CRM</span>
      </div>

      {/* Short line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <p className="text-sm text-slate-300">
          Contacts, favourites and follow-ups in one place.
        </p>
      </div>
    </div>
  );
}