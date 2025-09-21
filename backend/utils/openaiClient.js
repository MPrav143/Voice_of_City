// utils/openaiClient.js
const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function transcribeAudio(filePath, languageHint = "auto") {
  // Uses OpenAI Whisper style endpoint. Model name may change; adjust if needed.
  // Accepts audio file path and returns string transcript.
  try {
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1" // change to supported model if necessary
      // You could add "language" param if supported by your provider.
    });
    // transcription.text or transcription?.text
    return transcription.text ?? "";
  } catch (err) {
    console.error("OpenAI transcription error:", err);
    throw err;
  }
}

async function translateToEnglish(text, sourceLangHint = "auto") {
  // Use Chat/Responses API to translate text to English.
  // Adjust model name if needed for your OpenAI plan.
  try {
    const prompt = `Translate the following text to English. If it's already English, just return it unchanged.\n\nText:\n${text}`;
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini", // choose a model available to you; otherwise "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a helpful translator." },
        { role: "user", content: prompt }
      ]
    });
    // Depending on SDK, the shape may vary:
    const translated = resp.choices?.[0]?.message?.content ?? resp.choices?.[0]?.text;
    return translated?.trim() ?? text;
  } catch (err) {
    console.error("OpenAI translate error:", err);
    throw err;
  }
}

module.exports = {
  transcribeAudio,
  translateToEnglish
};
