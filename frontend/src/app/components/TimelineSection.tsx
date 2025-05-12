"use client";
import React, { useLayoutEffect } from "react";

import { useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TimelineSection = () => {
  const [active, setActive] = useState<"competition" | "talkshow" | "workshop">("competition");

  const timelineData = {
    competition: [
      { title: "Open Registration", date: "Tuesday | 13 Mei 2025" },
      { title: "Close Registration", date: "Saturday | 28 June 2025" },
      { title: "Last Submission of Works", date: "Monday | 30 June 2025" },
      { title: "Competition Judging", date: "Thursday | 03 July 2025" },
      { title: "Announcement of Finalists", date: "Monday | 07 July 2025" },
      { title: "Awarding Night", date: "Thursday | 17 July 2025" },
    ],
    talkshow: [
      { title: "Talkshow (Online)", date: "Monday | 14 June 2025" },
      { title: "Talkshow (Onsite)", date: "Wednesday | 17 July 2025" },
    ],
    workshop: [
      { title: "OPEN REGISTRATION", date: "Tuesday | 02 APRIL 2025" },
      { title: "MATERIAL RELEASE", date: "Thursdau | 18 APRIL 2025" },
      { title: "WORKSHOP DAY", date: "Saturday | 11 MAY 2025" },
      { title: "WORKSHOP START", date: "Wednesday | 02 MAY 2025" },
    ],
  };

  useLayoutEffect(() => {
    // if (window.innerWidth <= 768) return;

    const line = document.getElementById("line");
    const timelineContents = document.querySelectorAll(".timeline-point");

    if (!line || timelineContents.length === 0) return;

    const timelineContainer = document.querySelector(".timeline-container");

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      gsap.to(line, {
        scrollTrigger: {
          trigger: timelineContainer,
          start: "top center",
          end: "80% center",
          scrub: true,
        },
        height: "216vh",
      });
    });

    mm.add("(max-width: 768px)", () => {
      gsap.to(line, {
        scrollTrigger: {
          trigger: timelineContainer,
          start: "top center",
          end: "80% center",
          scrub: true,
        },
        height: "75%",
      });
    });

    timelineContents.forEach((content) => {
      gsap.fromTo(
        content,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: content,
            start: "top 100%",
            end: "top center",
            scrub: true,
          },
        }
      );
    });

    ScrollTrigger.refresh();
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
      {/* Decorative image at the top right */}
      <div
        className="absolute top-55 -right-70 z-0 mb-4 mr-4 opacity-20"
        style={{
          backgroundImage: "url('/assets/lines3.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '700px',
          height: '500px',
        }}
      ></div>
      {/* Decorative image 2 at the bottom right */}
      <div
        className="absolute top-55 -left-20 z-0 mb-4 mr-4 opacity-15"
        style={{
          backgroundImage: "url('/assets/lines1.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '700px',
          height: '700px',
        }}
      ></div>
      <h2
        className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-white mb-12"
        style={{
          textShadow: "0 0 15px rgba(77, 255, 255, 0.7)",
          fontStyle: "italic",
        }}
      >
        Timeline
      </h2>

      {/* Toggle Menu */} 
      <div className="menu-buttons">
        {(["competition"] as const).map((key) => (
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
    margin-left: 360px;
    transform: translateY(-150%);
    }
    .menu-btn {
      padding: 2px 8px; /* Smaller padding for smaller buttons */
      font-size: 12px; /* Smaller font size */
    }
    
    .timeline-line {
    position: absolute;
    top: 60px;
    left: 29%;
    transform: translateX(400%);
    width: 3px;
    height: 1220px;
    background-color: white;
    z-index: -1;
    }

    .timeline-content {
      transform: none; /* Reset the offset */
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: left;
    }

    .timeline-container {
     position: relative;
     height: 1220px;
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
      margin-top: -140px;
    }
  }

  @media (max-width: 541px) {
      .timeline-line {
      left: 37.5%;
      }
  }
  @media (max-width: 431px) {
      .timeline-line {
      left: 45%;
      }
  }
  @media (max-width: 415px) {
      .timeline-line {
      left: 46.7%;
      }
  }
  @media (max-width: 391px) {
      .timeline-line {
      left: 49%;
      }
  }
  @media (max-width: 376px) {
      .timeline-line {
      left: 50.5%;
      }
  }
  @media (max-width: 361px) {
      .timeline-line {
      left: 52.5%;
      }
  }
  @media (max-width: 345px) {
      .timeline-line {
      left: 54.4%;
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

        

        .timeline-point,
        .timeline-line,
        .circle,
        .timeline-text {
        will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          
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
