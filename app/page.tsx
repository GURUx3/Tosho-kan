"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import LibraryView from "@/components/library-view";
import UploadView from "@/components/upload-view";
import ReaderView from "@/components/reader-view";
import { addBook, getAllBooks } from "@/lib/bookService";
import { deleteBook } from "@/lib/bookService";
import { updateStatus } from "@/lib/bookService";

type View = "library" | "upload" | "reader";

// Updated to match Supabase structure
interface Book {
  id: string;
  title: string;
  filename: string;
  file_size: number;
  status: "done" | "started" | "not-started";
  file_url: string;
  created_at: string;
}

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("library");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Calculate storage used from books
  const storageUsed = books.reduce(
    (sum, book) => sum + book.file_size / (1024 * 1024),
    0
  );

  const handleRead = (book: Book) => {
    if (!book.file_url) {
      console.error("No PDF URL found for this book!");
      return;
    }

    window.open(book.file_url, "_blank");
  };

  // Load books from Supabase when component mounts
  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await getAllBooks();
        setBooks(data);
      } catch (error) {
        console.error("Failed to load books:", error);
        alert("Failed to load books. Check console for details.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  const handleAddBook = async (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    await addBook(file);
    const newBook: Book = {
      id: Date.now().toString(),
      title: file.name.replace(".pdf", ""),
      file_size: Number.parseFloat(fileSizeMB.toFixed(1)),
      status: "not-started",
      filename: file.name,
      file_url: "", // Will be set when uploaded to Supabase
      created_at: new Date().toISOString(),
    };
    setBooks([newBook, ...books]);
  };

  const handleDeleteBook = async (id: string) => {
    const book = books.find((b) => b.id === id);

    if (book) {
      await deleteBook(id);
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "done" | "started" | "not-started"
  ) => {
    await updateStatus(id, status);
    setBooks(books.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const handleViewReader = (book: Book) => {
    setSelectedBook(book);
    setCurrentView("reader");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        bookCount={books.length}
      />

      <main className="pt-20">
        {currentView === "library" && (
          <LibraryView
            books={books}
            onUpload={() => setCurrentView("upload")}
            onDelete={handleDeleteBook}
            onUpdateStatus={handleUpdateStatus}
            onRead={handleRead}
          />
        )}

        {currentView === "upload" && (
          <UploadView
            onAddBook={handleAddBook}
            onBackToLibrary={() => setCurrentView("library")}
            storageUsed={storageUsed}
          />
        )}

        {currentView === "reader" && selectedBook && (
          <ReaderView
            book={selectedBook}
            onBack={() => setCurrentView("library")}
          />
        )}
      </main>
    </div>
  );
}
