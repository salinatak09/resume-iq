"use client";

import { useState, DragEvent } from "react";
import { Upload, FileText, X, Sparkles } from "lucide-react";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (selectedFile?: File) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-xl shadow-teal-900/5 mx-3">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Analyze Resume
              </h2>
              <p className="text-sm text-slate-500">
                Upload your resume to get AI insights
              </p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`group flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
              dragging
                ? "border-teal-500 bg-teal-50"
                : "border-slate-200 bg-slate-50/50 hover:border-teal-400 hover:bg-teal-50/50"
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {file ? (
              <div className="flex w-full max-w-xs items-center gap-3 rounded-xl border border-teal-100 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 transition-transform group-hover:scale-105">
                  <Upload className="h-6 w-6" />
                </div>

                <p className="text-sm font-medium text-slate-700">
                  Drop your PDF here
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  or{" "}
                  <span className="font-medium text-teal-600">
                    browse files
                  </span>
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  PDF only • Max 10MB
                </p>
              </>
            )}
          </label>

          {/* Analyze Button */}
          <button
            disabled={!file}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-teal-600/30 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Analyze Resume
          </button>
        </div>
      </div>
    </div>
  );
}
