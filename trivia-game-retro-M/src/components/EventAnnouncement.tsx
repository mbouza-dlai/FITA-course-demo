import { useEffect } from "react";
import { type RandomEvent, EVENT_INFO } from "@/hooks/useTrivia";

interface EventAnnouncementProps {
  event: Exclude<RandomEvent, null>;
  onDismiss: () => void;
}

const EventAnnouncement = ({ event, onDismiss }: EventAnnouncementProps) => {
  const info = EVENT_INFO[event];

  useEffect(() => {
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 animate-event-pop">
        <p className={`font-arcade text-2xl md:text-5xl ${info.color} animate-blink`}
          style={{ textShadow: "0 0 20px currentColor, 0 0 40px currentColor" }}>
          {info.title}
        </p>
        <p className="font-terminal text-xl md:text-3xl text-muted-foreground">
          {info.subtitle}
        </p>
      </div>
    </div>
  );
};

export default EventAnnouncement;
