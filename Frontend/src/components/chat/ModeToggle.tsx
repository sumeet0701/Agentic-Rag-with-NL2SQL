import { QueryMode } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Database, FileText } from "lucide-react";

interface ModeToggleProps {
  mode: QueryMode;
  onToggle: () => void;
  disabled?: boolean;
}

export function ModeToggle({ mode, onToggle, disabled }: ModeToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          "relative flex items-center gap-2 rounded-full p-1 transition-all duration-300",
          "bg-muted border-2 border-border shadow-sm",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-label={`Switch to ${mode === "structured" ? "unstructured" : "structured"} mode`}
      >
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
            mode === "structured"
              ? "bg-toggle-structured text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Database className="w-4 h-4" />
          <span className="text-sm font-medium">Structured</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
            mode === "unstructured"
              ? "bg-toggle-unstructured text-accent-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Unstructured</span>
        </div>
      </button>
    </div>
  );
}
