"use client";

import {
  BookOpen,
  MoreVertical,
  Trash2,
  BookMarked,
  ExternalLink,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { Book } from "../lib/bookService";

interface LibraryViewProps {
  books: Book[];
  onUpload: () => void;
  onRead: (book: Book) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Book["status"]) => void;
}

const statusConfig = {
  done: {
    label: "Finished",
    color: "bg-green-500/20 text-green-400 border border-green-500/40",
  },
  started: {
    label: "Reading",
    color: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40",
  },
  "not-started": {
    label: "To Read",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  },
};

export default function LibraryView({
  books,
  onUpload,
  onRead,
  onDelete,
  onUpdateStatus,
}: LibraryViewProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [activeMenu]);

  if (books.length === 0) {
    return (
      <div className="w-full px-4 py-24 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="p-4 rounded-lg bg-muted mb-4">
            <BookOpen className="w-16 h-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your library is empty
          </h2>
          <p className="text-muted-foreground mb-8 max-w-sm text-center text-sm">
            Start building your collection by uploading your first PDF
          </p>
          <button
            onClick={onUpload}
            className="px-6 py-2.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 font-semibold text-sm border border-border"
          >
            Upload your first book
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Your Books
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {books.length} book{books.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={onUpload}
          className="px-5 py-2.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 font-semibold text-sm border border-border w-full sm:w-auto"
        >
          Add Book
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="glass-card rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 relative"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="p-2.5 rounded-lg bg-muted flex-shrink-0">
                <BookMarked className="w-6 h-6 text-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-base line-clamp-1 mr-8 sm:mr-0">
                  {book.title}
                </h3>

                <div className="flex items-center gap-3 mt-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusConfig[book.status]?.color
                    }`}
                  >
                    {statusConfig[book.status]?.label}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {(book.file_size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0 mt-1 sm:mt-0">
              <button
                onClick={() => onRead(book)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 font-medium text-sm border border-border flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Read Now
              </button>

              <div
                className="relative flex-shrink-0"
                ref={activeMenu === book.id ? menuRef : null}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === book.id ? null : book.id);
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {activeMenu === book.id && (
                  <div className="absolute right-0 top-full mt-2 glass-card rounded-lg shadow-2xl z-50 min-w-[160px] py-1 border border-white/10 bg-[#1a1a1a]">
                    {(
                      ["not-started", "started", "done"] as Book["status"][]
                    ).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          onUpdateStatus(book.id, status);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-white/10 transition-colors"
                      >
                        Mark as {statusConfig[status].label}
                      </button>
                    ))}

                    <div className="border-t border-white/10 my-1" />

                    <button
                      onClick={() => {
                        onDelete(book.id);
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-semibold transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
