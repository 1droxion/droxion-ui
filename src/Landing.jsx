import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* HERO */}
      <section className="text-center px-6 py-20 bg-gradient-to-br from-green-600 to-blue-800">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">🚀 Welcome to Droxion</h1>
        <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl mx-auto">
          AI-powered video creation — from script to reel — fully automated, fully you.
        </p>
        <Link
          to="/signup"
          className="bg-white text-black px-6 py-3 text-lg font-semibold rounded shadow hover:bg-gray-200"
        >
          Try Droxion Free →
        </Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-green-400">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 text-left text-sm md:text-base">
          {["Write Topic", "AI Writes Script", "Voice + Background", "Auto Upload"].map((step, i) => (
            <div key={i} className="bg-[#1e293b] p-5 rounded-lg border border-gray-600">
              <h3 className="text-xl font-semibold mb-2">Step {i + 1}</h3>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#111827] px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center text-green-400">Features</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-sm md:text-base">
          {[
            "🎙 Hindi + English AI Voiceovers",
            "🧠 GPT-powered Script Generation",
            "📼 Background Videos + Music",
            "💬 Dynamic Subtitles (Word-by-Word)",
            "🚀 Auto Post to Instagram/YouTube",
            "🧰 Custom Branding + Editor"
          ].map((f, i) => (
            <div key={i} className="bg-[#1e293b] p-4 rounded-lg border border-gray-600">
              {f}
            </div>
          ))}
        </div>
      </section>

      {/* PLANS PREVIEW */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-green-400 mb-4">Plans for Everyone</h2>
        <p className="text-white/70 mb-6">Start free. Upgrade when you're ready to grow viral.</p>
        <Link
          to="/plans"
          className="inline-block bg-green-500 px-6 py-3 rounded text-white font-semibold hover:bg-green-600"
        >
          View Pricing →
        </Link>
      </section>

      {/* CTA JOIN */}
      <section className="px-6 py-20 bg-green-700 text-center">
        <h2 className="text-3xl font-bold mb-4">Join thousands creating viral content with AI</h2>
        <Link
          to="/signup"
          className="bg-white text-black px-6 py-3 mt-4 inline-block font-semibold rounded hover:bg-gray-200"
        >
          Create Free Account →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white/70 py-6 text-center text-sm">
        © {new Date().getFullYear()} Droxion™ •{" "}
        <Link to="/privacy" className="underline">Privacy</Link> •{" "}
        <Link to="/terms" className="underline">Terms</Link> •{" "}
        <Link to="/support" className="underline">Support</Link>
      </footer>
    </div>
  );
}

export default Landing;
