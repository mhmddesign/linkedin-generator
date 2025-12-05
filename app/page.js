"use client";

import { useState } from "react";
import { Loader2, Copy, Send, Sparkles, CheckCircle } from "lucide-react";

// ============================================
// IMPORTANT: Paste your n8n webhook URL below
// ============================================
const N8N_WEBHOOK_URL = "https://redflower.app.n8n.cloud/webhook/generate-postv2";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const styleOptions = ["Professional", "Viral Hook", "Storytelling", "Contrarian"];
  const lengthOptions = ["Short", "Medium", "Long"];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsLoading(true);
    setError("");
    setGeneratedContent("");

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          style: style,
          length: length,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Try to parse as JSON first, fallback to text
      const responseText = await response.text();
      let content = responseText;

      try {
        const jsonData = JSON.parse(responseText);
        // Extract the actual content from common JSON structures
        content = jsonData.generatedContent ||
          jsonData.content ||
          jsonData.text ||
          jsonData.output ||
          jsonData.message ||
          jsonData.result ||
          responseText;
      } catch {
        // Response is plain text, use as-is
        content = responseText;
      }

      setGeneratedContent(content);
    } catch (err) {
      setError("Failed to connect to backend. Please check your webhook URL.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePublish = async () => {
    if (!generatedContent.trim()) {
      setError("No content to publish. Generate a post first.");
      return;
    }

    setIsPublishing(true);
    setError("");

    try {
      // Call our internal API route for publishing
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: generatedContent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      alert("Post sent to LinkedIn workflow!");
    } catch (err) {
      setError("Failed to publish. Please check your connection.");
      console.error("Error:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-400" />
            LinkedIn Viral Content Generator
          </h1>
          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
            by MHMD STUDIO
          </span>
        </header>

        {/* Main Card */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          {/* Input Section */}
          <div className="space-y-5">
            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-neutral-300 mb-2">
                Topic
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., AI in Education, Remote Work Tips..."
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Style & Length Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Style Dropdown */}
              <div>
                <label htmlFor="style" className="block text-sm font-medium text-neutral-300 mb-2">
                  Style
                </label>
                <select
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  {styleOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-neutral-800">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Length Dropdown */}
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-neutral-300 mb-2">
                  Length
                </label>
                <select
                  id="length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  {lengthOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-neutral-800">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  MHMD AI is crafting your post...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Post
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Output Section */}
          {(generatedContent || isLoading) && (
            <div className="mt-8 pt-8 border-t border-neutral-800">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Generated Post
              </label>
              <textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                placeholder={isLoading ? "Generating..." : "Your viral content will appear here..."}
                rows={8}
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
              />

              {/* Action Buttons */}
              {generatedContent && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 border border-neutral-700"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Publish to LinkedIn
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            Powered by <span className="text-blue-400 font-medium">MHMD STUDIO</span> & <span className="text-purple-400 font-medium">Gemini</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
