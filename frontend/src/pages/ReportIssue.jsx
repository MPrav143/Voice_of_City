import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Circle } from "lucide-react"; // fixed icon imports

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

  const [warning, setWarning] = useState("");
  const [timestamp, setTimestamp] = useState("");

  // Supported languages for speech recognition
  const supportedLanguages = [
    { label: "English", value: "en-US" },
    { label: "Hindi", value: "hi-IN" },
    { label: "Bengali", value: "bn-IN" },
    { label: "Urdu", value: "ur-IN" },
    { label: "Tamil", value: "ta-IN" },
    { label: "Telugu", value: "te-IN" },
    { label: "Malayalam", value: "ml-IN" },
    { label: "Other / Unsupported", value: "other" }, // fallback for regional languages
  ];

  // get geolocation once on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
          setLocation(coords);
        },
        (err) => {
          console.warn("Location error:", err);
          setLocation("Unavailable");
        }
      );
    }
  }, []);

  // Initialize speech recognition
  const initRecognition = (lang) => {
    if (lang === "other") return null; // skip unsupported languages
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
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

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (language === "other") {
      alert("Speech recognition unavailable. Please use audio recording.");
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

  // Audio recording fallback
  const toggleAudioRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) =>
          audioChunksRef.current.push(e.data);
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

    if (window.EXIF) {
      window.EXIF.getData(file, function () {
        const gps = window.EXIF.getTag(this, "GPSLatitude");
        const dateTaken = window.EXIF.getTag(this, "DateTimeOriginal");

        if (!gps || !dateTaken) {
          setWarning(
            "⚠️ This image seems shared/downloaded. Please upload a fresh photo."
          );
        } else {
          setWarning("");
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (warning) {
      alert("Cannot submit: " + warning);
      return;
    }
    setTimestamp(new Date().toISOString());

    console.log({
      image,
      location,
      timestamp: new Date().toISOString(),
    });

    alert("Issue submitted successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4 sm:mb-6 text-center">
        Report a Civic Issue
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg"
      >
        {/* Description + language + mic */}
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
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>

              {/* Mic button for supported languages */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2 rounded-full ${
                  isRecording && language !== "other"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {isRecording && language !== "other" ? (
                  <MicOff size={20} />
                ) : (
                  <Mic size={20} />
                )}
              </button>

              {/* Audio record button for unsupported languages */}
              {language === "other" && (
                <button
                  type="button"
                  onClick={toggleAudioRecording}
                  className={`p-2 rounded-full ${
                    isRecording ? "bg-red-500 text-white" : "bg-gray-200"
                  }`}
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
          {warning && <p className="text-red-600 mt-2">{warning}</p>}
        </div>

        {/* Location (hidden from user, just auto-filled) */}
        <input type="hidden" value={location} readOnly />

        {/* Submit */}
        <button className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded w-full font-semibold hover:bg-green-700 text-sm sm:text-base">
          Submit Issue
        </button>
      </form>
    </div>
  );
}
