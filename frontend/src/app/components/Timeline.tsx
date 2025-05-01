// src/app/components/Timeline.tsx
import {
    Timeline as ShadcnTimeline,
    TimelineContent,
    TimelineDate,
    TimelineHeader,
    TimelineIndicator,
    TimelineItem,
    TimelineSeparator,
    TimelineTitle,
} from "@/app/components/ui/timeline";

interface TimelineItemProps {
    id: number;
    date: string;
    title: string;
    description: string;
}

interface TimelineProps {
    items: TimelineItemProps[];
}

export function Timeline({ items }: TimelineProps) {
    return (
        <div className="bg-[#202021] py-16 px-4 flex items-center justify-center h-screen">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-[#a6ff4d] mb-12">
                    TIMELINE
                </h2>
                <ShadcnTimeline defaultValue={3} className="w-full">
                    {items.map((item) => (
                        <TimelineItem
                            key={item.id}
                            step={item.id}
                            className="group-data-[orientation=vertical]/timeline:sm:ms-32"
                        >
                            <TimelineHeader> 
                                <TimelineSeparator className="bg-[#8F8F8F]" /> 
                                <TimelineDate className="text-white group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
                                    {item.date}
                                </TimelineDate>
                                <TimelineTitle className="text-white sm:-mt-0.5">
                                    {item.title}
                                </TimelineTitle>
                                <TimelineIndicator className="border-[#8F8F8F]"/>
                            </TimelineHeader>
                            <TimelineContent className="text-[#8F8F8F]">
                                {item.description}
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </ShadcnTimeline>
            </div>
        </div>
    );
}


// import {
//     Timeline,
//     TimelineContent,
//     TimelineDate,
//     TimelineHeader,
//     TimelineIndicator,
//     TimelineItem,
//     TimelineSeparator,
//     TimelineTitle,
//   } from "./app/components/ui/timeline";
  
//   interface TimelineItem {
//     id: number;
//     date: string;
//     title: string;
//     description: string;
//   }
  
//   interface TimelineProps {
//     items: TimelineItem[];
//   }
  
//   export default function CustomTimeline({ items }: TimelineProps) {
//     return (
//       <div className="bg-dark py-16">
//         <Timeline defaultValue={3} className="max-w-4xl mx-auto">
//           {items.map((item) => (
//             <TimelineItem
//               key={item.id}
//               step={item.id}
//               className="group-data-[orientation=vertical]/timeline:sm:ms-32"
//             >
//               <TimelineHeader>
//                 <TimelineSeparator />
//                 <TimelineDate className="text-cyan group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
//                   {item.date}
//                 </TimelineDate>
//                 <TimelineTitle className="text-neon sm:-mt-0.5">
//                   {item.title}
//                 </TimelineTitle>
//                 <TimelineIndicator />
//               </TimelineHeader>
//               <TimelineContent className="text-cream">
//                 {item.description}
//               </TimelineContent>
//             </TimelineItem>
//           ))}
//         </Timeline>
//       </div>
//     );
//   }