// app/components/AnimatedSvgBackground.tsx

const AnimatedSvgBackground = () => {
  return (
    <>
      <div
        className="fixed inset-0 w-screen h-screen -z-10"
        style={{ backgroundColor: '#202021' }} // Updated to Off-Black from palette for a darker base
      >
        <svg
          viewBox="0 0 150 150"
          preserveAspectRatio="xMidYMid slice"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            {/* Gradient 1 uses Purple from palette: #8f03d1 */}
            <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
              <animate attributeName="fx" dur="50s" values="0%;3%;0%" repeatCount="indefinite" /> {/* Duration Increased */}
              <stop offset="0%" stopColor="rgba(143, 3, 209, 1)" />
              <stop offset="100%" stopColor="rgba(143, 3, 209, 0)" />
            </radialGradient>

            {/* Gradient 2 uses Magenta/Pink-Purple from palette: #c306aa */}
            <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
              <animate attributeName="fx" dur="35s" values="0%;3%;0%" repeatCount="indefinite" /> {/* Duration Increased */}
              <stop offset="0%" stopColor="rgba(195, 6, 170, 1)" />
              <stop offset="100%" stopColor="rgba(195, 6, 170, 0)" />
            </radialGradient>

            {/* Gradient 3 uses Cyan from palette: #4dffff */}
            <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
              <animate attributeName="fx" dur="30s" values="0%;3%;0%" repeatCount="indefinite" /> {/* Duration Increased */}
              <stop offset="0%" stopColor="rgb(44, 49, 140, 1)" />
              <stop offset="100%" stopColor="rgba(77, 136, 255, 0)" />
            </radialGradient>
          </defs>

          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0 0; -70 -50; 0 0; 70 50; 0 0; 50 -70; 0 0; -50 70; 0 0"
              dur="200s" repeatCount="indefinite" /> {/* Kept long duration */}
            <animateTransform attributeName="transform" type="rotate"
              from="0 75 75" to="360 75 75"
              dur="25s" repeatCount="indefinite" additive="sum" /> {/* Duration Increased */}
            <rect x="-7.5%" y="-7.5%" width="180%" height="180%" fill="url(#Gradient1)">
              <animateTransform attributeName="transform" type="scale"
                values="1 75 75; 1.03 75 75; 1 75 75; 0.97 75 75; 1 75 75"
                dur="15s" repeatCount="indefinite" /> {/* Duration Increased */}
            </rect>
          </g>

          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0 0; -80 0; 0 0; 80 0; 0 0; 0 -60; 0 0; 0 60; 0 0"
              dur="30s" repeatCount="indefinite" /> {/* Duration Increased */}
            <animateTransform attributeName="transform" type="rotate"
              from="0 75 75" to="-360 75 75"
              dur="30s" repeatCount="indefinite" additive="sum" /> {/* Duration Increased */}
            <rect x="5%" y="5%" width="150%" height="150%" fill="url(#Gradient2)">
              <animateTransform attributeName="transform" type="scale"
                values="1 75 75; 1.05 75 75; 1 75 75; 0.95 75 75; 1 75 75"
                dur="20s" repeatCount="indefinite" /> {/* Duration Increased */}
            </rect>
          </g>

          <g>
            <animateTransform attributeName="transform" type="translate"
              values="0 0; 60 60; 0 0; -60 -60; 0 0; 60 -60; 0 0; -60 60; 0 0"
              dur="35s" repeatCount="indefinite" /> {/* Duration Increased */}
            <animateTransform attributeName="transform" type="rotate"
              from="0 75 75" to="-360 75 75"
              dur="119s" repeatCount="indefinite" additive="sum" /> {/* Kept long duration */}
            <rect x="15%" y="15%" width="130%" height="130%" fill="url(#Gradient3)">
              <animateTransform attributeName="transform" type="scale"
                values="1 75 75; 1.07 75 75; 1 75 75; 0.93 75 75; 1 75 75"
                dur="25s" repeatCount="indefinite" /> {/* Duration Increased */}
            </rect>
          </g>

          <g id="stars-container">
            <g transform="translate(40 55)">
              <image href="/bintang4.png" x="-2.5" y="-2.5" width="5" height="5" className="star-image">
                <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.2; 0.8; 1" dur="10s" begin="0s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="scale" values="0; 1; 1; 0" keyTimes="0; 0.2; 0.8; 1" dur="10s" begin="0s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="rotate" values="0 0 0; 20 0 0" dur="10s" begin="0s" repeatCount="indefinite" additive="sum"/> {/* Duration Increased */}
              </image>
            </g>
            <g transform="translate(100 45)">
              <image href="/bintang2.png" x="-3" y="-3" width="6" height="6" className="star-image">
                <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.25; 0.75; 1" dur="12s" begin="1.5s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="scale" values="0; 1; 1; 0" keyTimes="0; 0.25; 0.75; 1" dur="12s" begin="1.5s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="rotate" values="0 0 0; -25 0 0" dur="12s" begin="1.5s" repeatCount="indefinite" additive="sum"/> {/* Duration Increased */}
              </image>
            </g>
            <g transform="translate(75 110)">
              <image href="/bintang4.png" x="-2" y="-2" width="4" height="4" className="star-image">
                <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.15; 0.85; 1" dur="9s" begin="0.7s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="scale" values="0; 1; 1; 0" keyTimes="0; 0.15; 0.85; 1" dur="9s" begin="0.7s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="rotate" values="0 0 0; 15 0 0" dur="9s" begin="0.7s" repeatCount="indefinite" additive="sum"/> {/* Duration Increased */}
              </image>
            </g>
            <g transform="translate(10 110)">
              <image href="/bintang2.png" x="-3.5" y="-3.5" width="7" height="7" className="star-image">
                <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.3; 0.7; 1" dur="15s" begin="2.2s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="scale" values="0; 1; 1; 0" keyTimes="0; 0.3; 0.7; 1" dur="15s" begin="2.2s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="rotate" values="0 0 0; -10 0 0" dur="15s" begin="2.2s" repeatCount="indefinite" additive="sum"/> {/* Duration Increased */}
              </image>
            </g>
            <g transform="translate(120 70)">
              <image href="/bintang4.png" x="-2.5" y="-2.5" width="5" height="5" className="star-image">
                <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.2; 0.8; 1" dur="11s" begin="3s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="scale" values="0; 1; 1; 0" keyTimes="0; 0.2; 0.8; 1" dur="11s" begin="3s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="rotate" values="0 0 0; 30 0 0" dur="11s" begin="3s" repeatCount="indefinite" additive="sum"/> {/* Duration Increased */}
              </image>
            </g>
            <g transform="translate(90 80)">
              <image href="/bintang2.png" x="-2" y="-2" width="4" height="4" className="star-image">
                <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.25; 0.75; 1" dur="10s" begin="1.1s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="scale" values="0; 1; 1; 0" keyTimes="0; 0.25; 0.75; 1" dur="10s" begin="1.1s" repeatCount="indefinite" /> {/* Duration Increased */}
                <animateTransform attributeName="transform" type="rotate" values="0 0 0; -15 0 0" dur="10s" begin="1.1s" repeatCount="indefinite" additive="sum"/> {/* Duration Increased */}
              </image>
            </g>
          </g>
        </svg>
      </div>
      <style jsx global>{`
        .star-image {
          filter: drop-shadow(0 0 2px rgba(255, 255, 220, 0.9))
                  drop-shadow(0 0 5px rgba(255, 255, 200, 0.7))
                  drop-shadow(0 0 10px rgba(255, 255, 180, 0.5));
        }
      `}</style>
    </>
  );
};

export default AnimatedSvgBackground;
