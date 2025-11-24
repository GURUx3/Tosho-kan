"use client";

import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";

interface Book {
  id: string;
  title: string;
  fileSize: number;
  status: "done" | "started" | "not-started";
  fileName: string;
  uploadDate: Date;
  pdfUrl?: string;
}

interface ReaderViewProps {
  book: Book;
  onBack: () => void;
}

export default function ReaderView({ book, onBack }: ReaderViewProps) {
  const handleOpenPDF = () => {
    if (book.pdfUrl) {
      window.location.href = book.pdfUrl; // Forces native app to open the file
    } else {
      alert(
        "PDF URL not available. Please add the pdfUrl property to your book object."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      <div className="glass-effect m-4 rounded-xl">
        <div className="h-16 flex items-center justify-between px-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h2 className="flex-1 text-center font-bold text-foreground truncate text-lg">
            {book.title}
          </h2>

          <button
            onClick={handleOpenPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/40 to-purple-500/20 text-cyan-300 hover:from-cyan-500/50 hover:to-purple-500/30 transition-all duration-300 font-semibold text-sm border border-cyan-500/40 hover:border-cyan-400/60"
          >
            <ExternalLink className="w-4 h-4" />
            Open PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass-card rounded-xl p-12 max-w-md text-center">
          <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/10 mb-4 inline-block">
            <BookOpen className="w-10 h-10 text-cyan-400" />
          </div>
          <h3 className="font-bold text-foreground mb-2 text-lg">
            Ready to Read
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Click "Open PDF" to view this book in your default reader.
          </p>
          <button
            onClick={handleOpenPDF}
            className="w-full px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500/30 to-purple-500/20 text-cyan-300 hover:from-cyan-500/40 hover:to-purple-500/30 transition-all duration-300 font-semibold text-sm border border-cyan-500/40 hover:border-cyan-400/60 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open PDF
          </button>
        </div>
      </div>
    </div>
  );
}
