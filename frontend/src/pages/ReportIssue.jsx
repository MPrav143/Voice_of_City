// src/components/ReportIssue.jsx
import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Circle } from "lucide-react";

export default function ReportIssue() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [language, setLanguage] = useState("en-US");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [preview, setPreview] = useState(null);

  const supportedLanguages = [
    { label: "English", value: "en-US" },
    { label: "Hindi", value: "hi-IN" },
    { label: "Bengali", value: "bn-IN" },
    { label: "Urdu", value: "ur-IN" },
    { label: "Tamil", value: "ta-IN" },
    { label: "Telugu", value: "te-IN" },
    { label: "Malayalam", value: "ml-IN" },
    { label: "Other / Unsupported", value: "other" },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => setLocation("Unavailable")
      );
    }
  }, []);

  // --- Speech Recognition & Audio Recording (same as before) ---
  const initRecognition = (lang) => {
    if (lang === "other") return null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return null;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => prev + " " + transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    return recognition;
  };

  const toggleSpeechRecognition = () => {
    if (language === "other") {
      alert("Speech recognition unavailable. Use audio recording.");
      return;
    }
    if (!isRecording) {
      const recognition = initRecognition(language);
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
      }
    } else {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
  };

  const toggleAudioRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          setAudioBlob(blob);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Audio recording error:", err);
        alert("Unable to access microphone.");
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // --- Submit Report ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description && !image && !audioBlob) {
      alert("Please provide a description, image, or audio.");
      return;
    }

    const token = localStorage.getItem("token"); // <- IMPORTANT
    if (!token) {
      alert("❌ You must be logged in to submit a report.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location);
    formData.append("timestamp", new Date().toISOString());
    formData.append("uniqueToken", Date.now());

    if (image) formData.append("image", image, `${Date.now()}_${image.name}`);
    if (audioBlob) formData.append("audio", audioBlob, `${Date.now()}_recording.wav`);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` }, // <- MUST include token
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (res.status === 409) {
        alert("⚠️ Similar report already exists.");
      } else if (res.status === 401) {
        alert("❌ Unauthorized. Please login.");
      } else if (data.success) {
        alert("✅ Issue submitted successfully!");
        setDescription("");
        setImage(null);
        setPreview(null);
        setAudioBlob(null);
      } else {
        alert("❌ Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting issue");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4 sm:mb-6 text-center">
        Report a Civic Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        {/* Description + Speech */}
        <div>
          <label className="block font-medium mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>Description</span>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border rounded p-1 text-sm sm:text-base"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2 rounded-full ${isRecording && language !== "other" ? "bg-red-500 text-white" : "bg-gray-200"}`}
              >
                {isRecording && language !== "other" ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {language === "other" && (
                <button
                  type="button"
                  onClick={toggleAudioRecording}
                  className={`p-2 rounded-full ${isRecording ? "bg-red-500 text-white" : "bg-gray-200"}`}
                >
                  <Circle size={20} />
                </button>
              )}
            </div>
          </label>

          <textarea
            placeholder="Describe the issue in detail..."
            className="w-full border p-3 rounded text-sm sm:text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          ></textarea>

          {audioBlob && (
            <audio controls className="mt-2 w-full">
              <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            </audio>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded text-sm sm:text-base"
            onChange={handleFileChange}
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-4 h-40 w-full object-cover rounded shadow"
            />
          )}
        </div>

        <input type="hidden" value={location} readOnly />
        <button className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded w-full font-semibold hover:bg-green-700 text-sm sm:text-base">
          Submit Issue
        </button>
      </form>
    </div>
  );
}
