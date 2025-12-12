import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";

interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

export function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
          <MessageSquare className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Start a conversation</h2>
        <p className="text-muted-foreground max-w-sm">
          Toggle between structured and unstructured modes, then type your question below to get started.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="flex flex-col gap-4 p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && messages[messages.length - 1]?.content === "" && null}
        {isLoading && messages[messages.length - 1]?.content !== "" && (
          <div className="flex gap-3">
            <div className="w-9" /> {/* Spacer for alignment */}
            <TypingIndicator />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
