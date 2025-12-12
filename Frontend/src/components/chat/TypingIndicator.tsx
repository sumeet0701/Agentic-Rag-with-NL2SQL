import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-4 py-3 bg-chat-bubble rounded-2xl rounded-bl-md shadow-sm animate-fade-in",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-chat-assistant typing-dot" />
        <span className="w-2 h-2 rounded-full bg-chat-assistant typing-dot" />
        <span className="w-2 h-2 rounded-full bg-chat-assistant typing-dot" />
      </div>
      <span className="ml-2 text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  );
}
