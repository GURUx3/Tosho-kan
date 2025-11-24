"use client";

import { BookOpen, Upload, Library } from "lucide-react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: "library" | "upload" | "reader") => void;
  bookCount: number;
}

export default function Navigation({
  currentView,
  onViewChange,
  bookCount,
}: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect mx-4 mt-4 sm:mx-auto sm:max-w-5xl sm:left-1/2 sm:transform sm:-translate-x-1/2">
      <div className="px-4 h-16 flex items-center justify-between sm:px-6">
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => onViewChange("library")}
        >
          <div className="p-2 rounded-lg bg-muted">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate">
              Tosho-kan
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              {bookCount} books
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange("library")}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm ${
              currentView === "library"
                ? "bg-muted text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
            }`}
          >
            <Library className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
          </button>

          <button
            onClick={() => onViewChange("upload")}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm ${
              currentView === "upload"
                ? "bg-muted text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
