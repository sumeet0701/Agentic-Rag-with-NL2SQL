import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm",
          isUser ? "bg-chat-user" : "bg-chat-assistant"
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-chat-user-foreground" />
        ) : (
          <Bot className="w-5 h-5 text-chat-assistant-foreground" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[75%] px-4 py-3 rounded-2xl shadow-sm",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-bubble text-chat-bubble-foreground rounded-bl-md border border-border"
        )}
      >
        <div className="text-sm leading-relaxed break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 italic mb-2">{children}</blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-2 text-sm font-mono">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-2">
                  <table className="min-w-full border-collapse border border-border">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
              th: ({ children }) => (
                <th className="border border-border px-3 py-2 text-left font-semibold text-sm">{children}</th>
              ),
              td: ({ children }) => <td className="border border-border px-3 py-2 text-sm">{children}</td>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {!isUser && message.content === "" && (
          <span className="inline-block w-2 h-4 bg-chat-assistant/60 animate-pulse" />
        )}
      </div>
    </div>
  );
}
