"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TimelineSection = () => {
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
      gsap.to(content, {
        scrollTrigger: {
          trigger: content,
          start: "top 70%",
          end: "20% center",
          scrub: true,
        },
        opacity: 1,
      });
    });
  }, []);

  return (
    <section className="timeline bg-black" id="timeline">
      <h1>Timeline</h1>
      <div className="timeline-container">
        <div className="timeline-line" id="line"></div>
        <div className="timeline-content">
          {[
            { title: "OPEN REGISTRATION", date: "TUESDAY | 18 MARCH 2024" },
            { title: "CLOSE REGISTRATION", date: "SUNDAY | 18 APRIL 2024" },
            { title: "TECHNICAL MEETING", date: "FRIDAY | 03 MAY 2024" },
            { title: "COMPETITION START", date: "SATURDAY | 04 MAY 2024" },
          ].map((item, idx) => (
            <div className="timeline-point" key={idx}>
              <div className="circle"></div>
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
          margin-bottom: 130px;
        }

        .timeline-container {
          width: 90%;
          display: flex;
        }

        .timeline-line {
          width: 5px;
          height: 0;
          background-color: white;
          margin-left: 6%;
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
          background-color: white;
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
