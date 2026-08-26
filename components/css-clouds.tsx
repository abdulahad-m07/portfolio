"use client"

export default function CssClouds({ className }: { className?: string }) {
  return (
    <div className={className} style={{ background: "linear-gradient(180deg, #0b1026 0%, #1a2744 30%, #2d4a7a 60%, #4a7ab5 85%, #6ba3d6 100%)", overflow: "hidden", position: "relative" }}>
      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={`star-${i}`}
          style={{
            position: "absolute",
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            background: "#fff",
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            opacity: 0.3 + Math.random() * 0.5,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Cloud layers */}
      <div className="cloud-layer cloud-1" />
      <div className="cloud-layer cloud-2" />
      <div className="cloud-layer cloud-3" />
      <div className="cloud-layer cloud-4" />

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
        @keyframes drift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes driftReverse {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .cloud-layer {
          position: absolute;
          border-radius: 50%;
          filter: blur(30px);
          will-change: transform;
        }
        .cloud-1 {
          width: 300px;
          height: 120px;
          background: rgba(255, 255, 255, 0.08);
          top: 55%;
          left: -300px;
          animation: drift 45s linear infinite;
        }
        .cloud-2 {
          width: 500px;
          height: 160px;
          background: rgba(255, 255, 255, 0.06);
          top: 60%;
          right: -500px;
          animation: driftReverse 60s linear infinite;
          animation-delay: -10s;
        }
        .cloud-3 {
          width: 350px;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          top: 70%;
          left: -350px;
          animation: drift 35s linear infinite;
          animation-delay: -5s;
          filter: blur(20px);
        }
        .cloud-4 {
          width: 600px;
          height: 200px;
          background: rgba(255, 255, 255, 0.05);
          top: 45%;
          left: -600px;
          animation: drift 70s linear infinite;
          animation-delay: -20s;
          filter: blur(40px);
        }
      `}</style>
    </div>
  )
}
