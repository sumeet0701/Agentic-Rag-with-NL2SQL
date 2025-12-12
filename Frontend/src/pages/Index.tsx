import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";

const Index = () => {
  const { messages, isLoading, mode, sendMessage, clearMessages, toggleMode } = useChat();

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader
        mode={mode}
        onToggleMode={toggleMode}
        onClear={clearMessages}
        hasMessages={messages.length > 0}
        isLoading={isLoading}
      />
      
      <ChatContainer messages={messages} isLoading={isLoading} />
      
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        placeholder={`Ask a ${mode} question...`}
      />
    </div>
  );
};

export default Index;
