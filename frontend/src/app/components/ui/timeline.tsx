import * as React from "react"
import { cn } from "@/app/components/lib/utils"

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: number
  }
>(({ className, children, defaultValue = 0, ...props }, ref) => {
  const childrenWithStep = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child

    const isCompleted = index < defaultValue
    return React.cloneElement(child, {
      "data-completed": isCompleted,
      "data-current": index === defaultValue,
    })
  })

  return (
    <div
      ref={ref}
      className={cn("relative border-l-2 border-white/30 space-y-8", className)}
      {...props}
    >
      {childrenWithStep}
    </div>
  )
})
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    step?: number
  }
>(({ className, children, step, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative pl-8 group", className)}
    data-step={step}
    {...props}
  >
    {children}
  </div>
))
TimelineItem.displayName = "TimelineItem"

const TimelineIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "absolute -left-10 top-0 w-4 h-4 rounded-full border-2 border-white bg-white transition-colors duration-300 group-data-[completed=true]:bg-green-400",
      className
    )}
    {...props}
  />
))
TimelineIndicator.displayName = "TimelineIndicator"

const TimelineSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute left-1.5 top-6 h-full w-1 bg-white/20", className)}
    {...props}
  />
))
TimelineSeparator.displayName = "TimelineSeparator"

const TimelineDate = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-1 text-sm text-white/70", className)}
    {...props}
  />
))
TimelineDate.displayName = "TimelineDate"

const TimelineTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-lg font-semibold text-white group-data-[completed=true]:text-green-300",
      className
    )}
    {...props}
  />
))
TimelineTitle.displayName = "TimelineTitle"

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-white/80 leading-relaxed", className)}
    {...props}
  />
))
TimelineContent.displayName = "TimelineContent"

export {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineSeparator,
  TimelineDate,
  TimelineTitle,
  TimelineContent,
}
