export type QueryMode = "structured" | "unstructured";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  mode: QueryMode;
}
