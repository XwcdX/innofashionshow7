"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TimelineSection = () => {
  const [active, setActive] = useState<"contest" | "talkshow" | "workshop">("contest");

  const timelineData = {
    contest: [
      { title: "OPEN REGISTRATION", date: "Tuesday | 18 MARCH 2025" },
      { title: "CLOSE REGISTRATION", date: "Sunday | 18 APRIL 2025" },
      { title: "TECHNICAL MEETING", date: "Friday | 03 MAY 2025" },
      { title: "COMPETITION START", date: "Saturday | 04 MAY 2025" },
    ],
    talkshow: [
      { title: "OPEN REGISTRATION", date: "Monday | 25 MARCH 2025" },
      { title: "TALKSHOW SPEAKER REVEAL", date: "Wednesday | 10 APRIL 2025" },
      { title: "EVENT DAY", date: "Sunday | 28 APRIL 2025" },
      { title: "TALKSHOW START", date: "Saturday | 01 MAY 2025" },
    ],
    workshop: [
      { title: "OPEN REGISTRATION", date: "Tuesday | 02 APRIL 2025" },
      { title: "MATERIAL RELEASE", date: "Thursdau | 18 APRIL 2025" },
      { title: "WORKSHOP DAY", date: "Saturday | 11 MAY 2025" },
      { title: "WORKSHOP START", date: "Wednesday | 02 MAY 2025" },
    ],
  };

  useEffect(() => {
  const line = document.getElementById("line");
  const points = document.querySelectorAll(".timeline-point");

  if (!line || !points.length) return;

  gsap.set(points, { opacity: 0, y: 50 });

  // Animasi untuk garis (line)
  gsap.to(line, {
    scrollTrigger: {
      trigger: ".timeline-container",
      start: "top center",
      end: "bottom center",
      scrub: true,
    },
    height: window.innerWidth > 768 ? "130vh" : "45vh",
    ease: "none",
  });

  // Timeline untuk setiap .timeline-point
  points.forEach((point) => {
    const circle = point.querySelector(".circle");
    const text = point.querySelector(".timeline-text");

    if (!circle || !text) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: point,
        start: "top 80%", // Lebih cepat muncul
        end: "top 60%",
        scrub: true,
      },
    });

    tl.to(point, { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" }, 0)
      .fromTo(
        circle,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        0
      )
      .fromTo(
        text,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power1.out" },
        0.1
      );
  });
}, [active]);


  return (
    <section
      className="timeline bg-black mt-20"
      id="timeline"
      style={{
        background: "transparent",
        scrollSnapAlign: "start",
      }}
    >
      {/* Decorative image at the bottom right */}
      {/* <div 
        className="absolute  -bottom-55 -right-20 z-0 mb-4 mr-4 opacity-100"
        style={{
          backgroundImage: "url('/assets/layer1.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '700px', // Adjust size as needed
          height: '400px', // Adjust size as needed
        }}
      ></div> */}
      <h2
        className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#4dffff] mb-12"
        style={{
          textShadow: "0 0 15px rgba(77, 255, 255, 0.7)",
          fontStyle: "italic",
        }}
      >
        Timeline
      </h2>

      {/* Toggle Menu */}
      <div className="menu-buttons">
        {(["contest", "talkshow", "workshop"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`menu-btn ${active === key ? "active" : ""}`}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="timeline-container">
        <div className="timeline-line" id="line"></div>
        <div className="timeline-content">
          {timelineData[active].map((item, idx) => (
            <div className="timeline-point" key={idx}>
              <div className="circle border-4 border-white bg-purple-600 "></div>
              <div className="timeline-text">
                <h1>{item.title}</h1>
                <p>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
@media (max-width: 768px) {
    .circle{
    margin-left: 35px;
    }
    .menu-btn {
      padding: 2px 8px; /* Smaller padding for smaller buttons */
      font-size: 12px; /* Smaller font size */
    }
    
    .timeline-line {
      display: none; /* Hides the vertical line */
    }

    .timeline-container {
      flex-direction: column;
      align-items: center; /* Center the content horizontally */
    }

    .timeline-content {
      transform: none; /* Reset the offset */
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .timeline-point {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-bottom: 40px;
      height: auto;
    }

    .timeline-text {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  .timeline {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px 0;
  }

  .timeline > h1 {
    color: white;
    font-size: 60px;
    width: 80%;
    margin-bottom: 30px;
  }

  .menu-buttons {
    display: flex;
    gap: 16px;
    margin-bottom: 80px;
  }

  .menu-btn {
    padding: 8px 20px;
    font-weight: bold;
    border: 2px solid white;
    background: transparent;
    color: white;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .menu-btn.active,
  .menu-btn:hover {
    background-color: white;
    color: black;
  }

  .timeline-container {
    width: 90%;
    display: flex;
  }

  .timeline-line {
    width: 3px;
    height: 0;
    background-color: white;
    margin-left: 37%;
    margin-top: 30px;
  }

  .timeline-content {
    width: 90%;
    transform: translateX(-23px);
  }

  .timeline-point {
    height: 43vh;
    display: flex;
  }

  .circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-top: 10px;
  }

  .timeline-text {
    margin-left: 30px;
    color: white;
  }

  .timeline-text > h1 {
    font-size: 32px;
    letter-spacing: 1px;
  }

  .timeline-text > p {
    font-size: 18px;
  }

        .timeline {
          width: 100%;
          height: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 80px 0;
        }

        .timeline > h1 {
          color: white;
          font-size: 60px;
          width: 80%;
          margin-bottom: 30px;
        }

        .menu-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 80px;
        }

        .menu-btn {
          padding: 8px 20px;
          font-weight: bold;
          border: 2px solid white;
          background: transparent;
          color: white;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .menu-btn.active,
        .menu-btn:hover {
          background-color: white;
          color: black;
        }

        .timeline-point,
.timeline-line,
.circle,
.timeline-text {
  will-change: transform, opacity;
}
  
        .timeline-container {
          width: 90%;
          display: flex;
          
          
        }

        .timeline-line {
          width: 3px;
          height: 0;
          background-color: white;
          margin-left: 37%;
          margin-top: 30px;
        }

        .timeline-content {
          width: 90%;
          transform: translateX(-23px);
        }

        .timeline-point {
          height: 43vh;
          display: flex;
          opacity: 0;
        }

        .circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-top: 10px;
        }

        .timeline-text {
          margin-left: 30px;
          color: white;
        }

        .timeline-text > h1 {
          font-size: 32px;
          letter-spacing: 1px;
        }

        .timeline-text > p {
          font-size: 18px;
        }
      `}</style>
    </section>
  );
};

export default TimelineSection;
