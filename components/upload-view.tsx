"use client";

import type React from "react";
import { Upload, ArrowLeft, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";

interface UploadViewProps {
  onAddBook: (file: File) => void;
  onBackToLibrary: () => void;
  storageUsed: number; // already in MB (fixed in Home)
}

export default function UploadView({
  onAddBook,
  onBackToLibrary,
  storageUsed,
}: UploadViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const storageLimit = 50; // limit in MB
  const storagePercent = (storageUsed / storageLimit) * 100;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newErrors: Record<string, string> = {};
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (file.type !== "application/pdf") {
        newErrors[file.name] = "Only PDF files allowed";
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 50) {
        newErrors[file.name] = "File too large (max 50MB)";
        return;
      }

      if (storageUsed + fileSizeMB > storageLimit) {
        newErrors[file.name] = "Not enough storage space";
        return;
      }

      validFiles.push(file);
    });

    setErrors(newErrors);
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const uploadAll = () => {
    selectedFiles.forEach((file) => onAddBook(file));
    setSelectedFiles([]);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <button
        onClick={onBackToLibrary}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Upload Books
        </h2>
        <p className="text-muted-foreground text-sm">
          Add new PDFs to your library. Drag and drop or select files, then
          click Upload.
        </p>
      </div>

      {/* Storage indicator */}
      <div className="mb-8 p-4 rounded-md bg-card/50 border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Storage Usage
          </span>

          {/* FIX: Showing correct MB values */}
          <span className="text-xs text-muted-foreground">
            {storageUsed.toFixed(1)} MB / {storageLimit} MB
          </span>
        </div>

        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${storagePercent}%` }}
          />
        </div>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border/50 bg-card/30 hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-lg bg-primary/10 mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-medium text-foreground mb-1">
            Drop your PDFs here
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse your computer
          </p>
          <p className="text-xs text-muted-foreground">
            Max 50MB per file • PDF only
          </p>
        </div>
      </div>

      {/* Validation errors */}
      {Object.entries(errors).length > 0 && (
        <div className="mt-6 space-y-2">
          {Object.entries(errors).map(([fileName, error]) => (
            <div
              key={fileName}
              className="flex items-center gap-3 p-3 rounded-md bg-destructive/10 border border-destructive/20"
            >
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive">{fileName}</p>
                <p className="text-xs text-destructive/80">{error}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recently selected (NOT uploaded yet) */}
      {selectedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Selected ({selectedFiles.length})
          </h3>

          <div className="space-y-2">
            {selectedFiles
              .slice(-5)
              .reverse()
              .map((file) => (
                <div
                  key={file.name}
                  className="p-3 rounded-md bg-card/50 border border-border/50 text-sm"
                >
                  <p className="text-foreground truncate font-medium">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ))}
          </div>

          {/* Upload button */}
          <button
            onClick={uploadAll}
            className="mt-6 w-full py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Upload Files
          </button>
        </div>
      )}
    </div>
  );
}
