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
      { title: "OPEN REGISTRATION", date: "Monday| 25 MARCH 2025" },
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
    const timelineContents = document.querySelectorAll(".timeline-point");

    if (!line) return;

    if (window.innerWidth > 768) {
      gsap.to(line, {
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top center",
          end: "80% center",
          scrub: true,
        },
        height: "130vh",
      });
    } else {
      gsap.to(line, {
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top center",
          end: "1000% center",
          scrub: true,
        },
        height: "45vh",
      });
    }

    timelineContents.forEach((content) => {
      gsap.fromTo(
        content,
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: content,
            start: "top 70%",
            end: "20% center",
            scrub: true,
          },
          opacity: 1,
        }
      );
    });
  }, [active]);

  return (
    <section
      className="timeline bg-black"
      id="timeline"
      style={{
        background: "transparent",
        scrollSnapAlign: "start",
      }}
    >
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
