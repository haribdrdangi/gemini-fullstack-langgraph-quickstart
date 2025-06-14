import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Activity, Search, TextSearch, Brain, Pen } from 'lucide-react';
import type { ProcessedEvent } from '../ActivityTimeline';
import { truncateData } from '@/lib/utils'; // Import truncateData
import { cn } from "@/lib/utils"; // cn is already imported

interface TimelineEventProps {
  event: ProcessedEvent;
  isLast: boolean;
  isLoading: boolean;
}

// TimelineIcon component is implicitly what getEventIcon returns.
// We will adjust its class directly in the getEventIcon function.
const getEventIcon = (title: string) => {
  const iconClasses = "h-3.5 w-3.5 text-accent"; // Adjusted size and color
  if (title.toLowerCase().includes('generating')) {
    return <TextSearch className={iconClasses} />;
  } else if (title.toLowerCase().includes('thinking')) {
    // Spinner for 'thinking' state, potentially the one referred to in prompt
    return <Loader2 className={cn(iconClasses, "animate-spin")} />;
  } else if (title.toLowerCase().includes('reflection')) {
    return <Brain className={iconClasses} />;
  } else if (title.toLowerCase().includes('research')) {
    return <Search className={iconClasses} />;
  } else if (title.toLowerCase().includes('finalizing')) {
    return <Pen className={iconClasses} />;
  }
  return <Activity className={iconClasses} />;
};

const TimelineEvent: React.FC<TimelineEventProps> = ({ event, isLast, isLoading }) => {
  const renderData = (data: any) => {
    if (typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data)) {
      // Make array data more readable, perhaps one item per line if it's too long
      if (data.join(', ').length > 100) {
        return (
          <ul className="list-disc list-inside">
            {data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      }
      return data.join(', ');
    }
    // For objects, consider a more structured display if they are not too complex
    if (typeof data === 'object' && data !== null) {
        const keys = Object.keys(data);
        if (keys.length > 0 && keys.length < 5 && JSON.stringify(data).length < 200) {
             return (
                <ul className="text-xs space-y-0.5">
                {keys.map(key => (
                    <li key={key}><span className="font-medium">{key}:</span> {String(data[key])}</li>
                ))}
                </ul>
             );
        }
    }
    return JSON.stringify(data);
  };

  const formattedData = renderData(event.data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      // className="relative pl-10 pb-5" // Original classes
      // The prompt suggests: flex items-start gap-2.5 py-2 text-sm
      // Given the absolute positioning of icon/line, direct flex conversion is complex.
      // We'll keep relative and adjust padding/margins and child styles.
      className="relative pl-10 py-2 text-sm" // Adjusted padding, added base text-sm
    >
      {!isLast || (isLoading && isLast) ? (
        // Dotted Line: from w-0.5 bg-border to w-px border-l border-dotted border-border/60
        // The left position might need slight adjustment if icon size changes significantly.
        // Icon container is h-9 w-9, icon itself is h-3.5 w-3.5. (approx 14px). Center of 36px is 18px.
        // A 1.5 padding on 36px means inner area is 30px. Icon 14px. Centered.
        // Line starts at top-[22px] (middle of icon container's height roughly), left-[18px] (center of icon container's width)
        <div className="absolute left-[calc(2.25rem/2)] top-[calc(2.25rem/2+0.75rem)] h-full w-px border-l border-dotted border-border/60" />
      ) : null}
      {/* Icon Container: bg-accent/15 p-1.5 rounded-full. Original: h-9 w-9 bg-muted rounded-full ring-2 ring-background */}
      <div className="absolute left-0 top-[0.375rem] h-9 w-9 rounded-full bg-accent/15 flex items-center justify-center p-1.5">
        {/* top-3 (12px) becomes top-[0.375rem] (6px) if py-2 on root. mt-0.5 on icon container. */}
        {getEventIcon(event.title)}
      </div>
      {/* Text Content Container: ml-2 is current. With pl-10 on root, effective pl is large. */}
      <div className="ml-1"> {/* Adjusted margin for text content */}
        {/* Title: text-sm font-medium text-foreground/90 */}
        <p className="text-sm font-medium text-foreground/90 mb-0.5">{event.title}</p>
        {/* Data: text-xs text-muted-foreground/90 mt-0.5. Apply truncateData here. */}
        <p className="text-xs text-muted-foreground/90 mt-0.5 leading-snug">
          {truncateData(formattedData)}
        </p>
      </div>
    </motion.div>
  );
};

export default TimelineEvent;
