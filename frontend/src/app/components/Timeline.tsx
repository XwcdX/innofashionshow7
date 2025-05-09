"use client"

import {
  Timeline as ShadcnTimeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/app/components/ui/timelinedetails"
import { useState } from "react"
import Image from "next/image"


const TIMELINES = {
  lomba: {
    title: "TIMELINE LOMBA",
    items: [
        {
            id: 1,
            date: "10 Mei 2025",
            title: "Open Registration",
            description: "asd",
          },
          {
            id: 2,
            date: "28 Juni 2025",
            title: "Close Registration",
            description: "ef",
          },
          {
            id: 3,
            date: "30 Juni 2025",
            title: "Last Submission Karya",
            description: "ch",
          },
          {
            id: 4,
            date: "3 Juli 2025",
            title: "Penjurian Lomba",
            description: "jt",
          },
         {
            id: 5,
            date: "7 Juli 2025",
            title: "Pengumuman Finalis",
            description: "er",
          },
          {
            id: 6,
            date: "17 Juli 2025",
            title: "Awarding Night",
            description: "lg",
          },
    ]
  },
  workshop: {
    title: "TIMELINE WORKSHOP",
    items: [
        {
            id: 1,
            date: "10 Mei 2025",
            title: "Open Registration",
            description: "asd",
          },
          {
            id: 2,
            date: "28 Juni 2025",
            title: "Close Registration",
            description: "ef",
          },
          {
            id: 3,
            date: "30 Juni 2025",
            title: "Last Submission Karya",
            description: "ch",
          },
          {
            id: 4,
            date: "3 Juli 2025",
            title: "Penjurian Lomba",
            description: "jt",
          }
    ]
  },
  talkshow: {
    title: "TIMELINE TALKSHOW",
    items: [
        {
            id: 1,
            date: "10 Mei 2025",
            title: "Open Registration",
            description: "asd",
          },
          {
            id: 2,
            date: "28 Juni 2025",
            title: "Close Registration",
            description: "ef",
          },
          // Add timeline items...
    ]
  }
}

export function Timeline() {
  const [currentTimeline, setCurrentTimeline] = useState<keyof typeof TIMELINES>("lomba")

  return (
    <div
  className="min-h-screen flex items-center justify-center py-16 font-neue-montreal"
      style={{ 
        background: 'transparent',
        scrollSnapAlign: 'start'
      }}
>

      <div className="max-w-4xl mx-auto relative ">
        {/* Lines Asset (bottom-left corner) */}
        <div className="transform scale-210 absolute -bottom-3 -left-25 w-40 h-40">
          <Image
          src="/assets/lines1.png"
          alt=""
          fill
          className="object-contain"
          priority
          />
        </div>
      
        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {Object.keys(TIMELINES).map((key) => (
            <button
              key={key}
              onClick={() => setCurrentTimeline(key as keyof typeof TIMELINES)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentTimeline === key ? 'bg-[#a6ff4d]' : 'bg-[#8F8F8F]'
              }`}
              aria-label={`Show ${key} timeline`}
            />
          ))}
        </div>
        

        {/* Timeline Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#a6ff4d] mb-12"
        style={{ fontFamily: "Moderniz, sans-serif" }}>
          {TIMELINES[currentTimeline].title}
        </h2>

        
        {/* Timeline Content */}
        <ShadcnTimeline defaultValue={1} className="flex flex-col items-center w-full ">
          {TIMELINES[currentTimeline].items.map((item) => (
            <TimelineItem
              key={item.id}
              step={item.id}
              className="grid sm:grid-cols-[150px_1fr] gap-4 items-start sm:items-center "
            >
              <TimelineHeader>
                <TimelineSeparator className="bg-[#8F8F8F]" />
                <TimelineDate className="text-white group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
                  {item.date}
                </TimelineDate>
                <TimelineTitle className="text-white sm:-mt-0.5 ">
                  {item.title}
                </TimelineTitle>
                <TimelineContent className="text-[#8F8F8F]">
                {item.description}
              </TimelineContent>
                <TimelineIndicator className="border-[#8F8F8F]" />
              </TimelineHeader>
            </TimelineItem>
          ))}
        </ShadcnTimeline>
      </div>
    </div>
  )
}