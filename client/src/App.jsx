import { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSpeak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speechSynthesis.speak(speech);
  };
  
  const startListening = () => {
  const recognition = new window.webkitSpeechRecognition();

  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = async (event) => {
    setLoading(true);
    const speechText = event.results[0][0].transcript;

    console.log("User said:", speechText);
    setInput(speechText);

    // send to backend
    const res = await axios.post("http://localhost:5000/correct", {
      sentence: speechText,
    });

    const fullResponse = `
      Correct sentence: ${res.data.corrected}.
      Explanation: ${res.data.explanation}.
      My Response: ${res.data.myResponce}.
      Follow: ${res.data.followUpQuestion}.
    `;
    setResult(fullResponse);
    setLoading(false);
    handleSpeak(fullResponse);
    
  };
};
  return (
    <div style={{ padding: "40px" }}>
      <h1>AI English Tutor</h1>

      
      <button onClick={startListening}>🎤 Speak</button>
      <div style={{ marginTop: "20px" }}>
      {loading && <p>AI is thinking...</p>}
  {input && (
    <div style={{ textAlign: "right", marginBottom: "15px" }}>
      <span style={{
        background: "#DCF8C6",
        padding: "10px",
        borderRadius: "10px"
      }}>
        {input}
      </span>
    </div>
  )}

  
  <div style={{ display: "flex", gap: "10px" }}>
  {result && (
    <span style={{
      background: "#EEE",
      padding: "10px",
      borderRadius: "10px"
    }}>
      {result}
    </span>
  )}
</div>

      </div>
      
    </div>
  );
}

export default App;