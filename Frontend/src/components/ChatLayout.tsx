import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Plus, Trash2, MessageSquare } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  date: string;
}

const ChatLayout = () => {
  // Mock history data - replace with actual state/backend data later
  const [history, setHistory] = useState<ChatSession[]>([
    { id: '1', title: 'Previous Analysis', date: '2024-03-20' },
    { id: '2', title: 'SQL Query Help', date: '2024-03-19' },
  ]);
  const [sessionKey, setSessionKey] = useState(0);

  const handleNewChat = () => {
    // Save current session to history
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Conversation ${new Date().toLocaleTimeString()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setHistory((prev) => [newSession, ...prev]);
    // Reset the chat screen by changing the key
    setSessionKey((prev) => prev + 1);
  };

  const handleDeleteChat = (id: string) => {
    setHistory(prev => prev.filter(chat => chat.id !== id));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r bg-gray-50/50 dark:bg-gray-900/50 flex flex-col">
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-md hover:opacity-90 transition-opacity text-sm font-medium shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="text-xs font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">History</div>
          <div className="space-y-1">
            {history.map((chat) => (
              <div
                key={chat.id}
                className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer text-sm transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate text-gray-700 dark:text-gray-300">{chat.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 hover:text-red-600 rounded-md transition-all"
                  title="Delete chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <div key={sessionKey} className="h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ChatLayout;