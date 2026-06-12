import { useEffect, useState } from "react";
import "./App.css";

import ruby from "./assets/ruby.jpg";
import emerald from "./assets/emerald.jpg";
import pearl from "./assets/pearl.jpg";
import moonstone from "./assets/moonstone.jpg";
import diamond from "./assets/diamond.jpg";
import amethyst from "./assets/amethyst.jpg";

const API_URL = "http://localhost:5000/api/recommendations";

function App() {
  const [name, setName] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [concern, setConcern] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const gemstoneData = {
    Aries: {
      gemstone: "Ruby",
      image: ruby,
      reason: "Ruby is linked with confidence, courage, and leadership.",
      metal: "Gold",
      wearingDay: "Sunday",
    },
    Taurus: {
      gemstone: "Emerald",
      image: emerald,
      reason: "Emerald is linked with stability, communication, and growth.",
      metal: "Silver or Gold",
      wearingDay: "Wednesday",
    },
    Gemini: {
      gemstone: "Emerald",
      image: emerald,
      reason: "Emerald is linked with intelligence, focus, and communication.",
      metal: "Silver or Gold",
      wearingDay: "Wednesday",
    },
    Cancer: {
      gemstone: "Moonstone",
      image: moonstone,
      reason: "Moonstone is linked with intuition and emotional balance.",
      metal: "Silver",
      wearingDay: "Monday",
    },
    Leo: {
      gemstone: "Ruby",
      image: ruby,
      reason: "Ruby is linked with power, confidence, and positivity.",
      metal: "Gold",
      wearingDay: "Sunday",
    },
    Virgo: {
      gemstone: "Emerald",
      image: emerald,
      reason: "Emerald is linked with learning, clarity, and communication.",
      metal: "Silver or Gold",
      wearingDay: "Wednesday",
    },
    Libra: {
      gemstone: "Diamond",
      image: diamond,
      reason: "Diamond is linked with harmony, luxury, and relationships.",
      metal: "Silver or Platinum",
      wearingDay: "Friday",
    },
    Scorpio: {
      gemstone: "Ruby",
      image: ruby,
      reason: "Ruby is linked with strength, passion, and confidence.",
      metal: "Gold",
      wearingDay: "Sunday",
    },
    Sagittarius: {
      gemstone: "Amethyst",
      image: amethyst,
      reason: "Amethyst is linked with wisdom, peace, and spiritual growth.",
      metal: "Silver",
      wearingDay: "Saturday",
    },
    Capricorn: {
      gemstone: "Blue Sapphire",
      image: amethyst,
      reason: "Blue Sapphire is linked with discipline, focus, and stability.",
      metal: "Silver",
      wearingDay: "Saturday",
    },
    Aquarius: {
      gemstone: "Amethyst",
      image: amethyst,
      reason: "Amethyst is linked with calmness, creativity, and balance.",
      metal: "Silver",
      wearingDay: "Saturday",
    },
    Pisces: {
      gemstone: "Pearl",
      image: pearl,
      reason: "Pearl is linked with peace, emotional balance, and purity.",
      metal: "Silver",
      wearingDay: "Monday",
    },
  };

  const concernMessages = {
    Career:
      "This recommendation may support confidence, focus, and professional growth.",
    Education:
      "This recommendation may support learning, concentration, and clarity.",
    Love:
      "This recommendation may support emotional balance and relationship harmony.",
    Health:
      "This recommendation may support calmness, positivity, and mental balance.",
    Money:
      "This recommendation may support prosperity, decision-making, and stability.",
    Business:
      "This recommendation may support growth, leadership, and better decisions.",
    Marriage:
      "This recommendation may support harmony, understanding, and relationship balance.",
  };

  const getBudgetRange = (budgetValue) => {
    const amount = Number(budgetValue);

    if (!amount || amount <= 0) {
      return "Not provided";
    }

    if (amount <= 3000) {
      return "Budget Friendly Range: ₹1,000 - ₹3,000";
    }

    if (amount <= 8000) {
      return "Standard Range: ₹3,000 - ₹8,000";
    }

    if (amount <= 15000) {
      return "Premium Range: ₹8,000 - ₹15,000";
    }

    return "High Premium Range: ₹15,000+";
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.log("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getRecommendation = async () => {
    if (!name || !zodiac || !concern) {
      alert("Please enter your name, zodiac sign, and concern.");
      return;
    }

    const selectedGemstone = gemstoneData[zodiac];

    const finalResult = {
      name,
      zodiac,
      concern,
      budget: budget || "Not provided",
      budgetRange: getBudgetRange(budget),
      gemstone: selectedGemstone.gemstone,
      reason: selectedGemstone.reason,
      concernReason: concernMessages[concern],
      metal: selectedGemstone.metal,
      wearingDay: selectedGemstone.wearingDay,
      date: new Date().toLocaleDateString(),
    };

    setResult({
      ...finalResult,
      image: selectedGemstone.image,
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalResult),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save recommendation");
        return;
      }

      fetchHistory();
    } catch (error) {
      console.log("Backend connection error:", error);
    }
  };

  const clearForm = () => {
    setName("");
    setZodiac("");
    setConcern("");
    setBudget("");
    setResult(null);
  };

  const deleteHistoryItem = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      fetchHistory();
    } catch (error) {
      alert("Failed to delete recommendation");
    }
  };

  const clearAllHistory = async () => {
    try {
      await fetch(API_URL, {
        method: "DELETE",
      });

      setHistory([]);
    } catch (error) {
      alert("Failed to clear history");
    }
  };

  const copyRecommendation = () => {
    if (!result) return;

    const text = `
Gemstone Recommendation Report

Name: ${result.name}
Zodiac Sign: ${result.zodiac}
Concern: ${result.concern}
Budget: ₹${result.budget}
Recommended Gemstone: ${result.gemstone}
Reason: ${result.reason}
Concern Support: ${result.concernReason}
Suggested Metal: ${result.metal}
Wearing Day: ${result.wearingDay}
Budget Range: ${result.budgetRange}


`;

    navigator.clipboard.writeText(text);
    alert("Recommendation copied successfully!");
  };

  return (
    <div className="app">
      <h1>💎 Gemstone Recommendation App</h1>

      <p className="subtitle">
        Find your gemstone based on your zodiac sign, concern, and budget.
      </p>

      <div className="form-card">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={zodiac} onChange={(e) => setZodiac(e.target.value)}>
          <option value="">Select Zodiac Sign</option>
          <option value="Aries">Aries</option>
          <option value="Taurus">Taurus</option>
          <option value="Gemini">Gemini</option>
          <option value="Cancer">Cancer</option>
          <option value="Leo">Leo</option>
          <option value="Virgo">Virgo</option>
          <option value="Libra">Libra</option>
          <option value="Scorpio">Scorpio</option>
          <option value="Sagittarius">Sagittarius</option>
          <option value="Capricorn">Capricorn</option>
          <option value="Aquarius">Aquarius</option>
          <option value="Pisces">Pisces</option>
        </select>

        <select value={concern} onChange={(e) => setConcern(e.target.value)}>
          <option value="">Select Concern</option>
          <option value="Career">Career</option>
          <option value="Education">Education</option>
          <option value="Love">Love</option>
          <option value="Health">Health</option>
          <option value="Money">Money</option>
          <option value="Business">Business</option>
          <option value="Marriage">Marriage</option>
        </select>

        <input
          type="number"
          placeholder="Enter budget e.g. 5000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <div className="button-group">
          <button onClick={getRecommendation}>Get Recommendation</button>

          <button className="clear-btn" onClick={clearForm}>
            Clear
          </button>
        </div>
      </div>

      {result && (
        <div className="result-card">
          <h2>Hello, {result.name}! 👋</h2>
          <h3>Your Recommended Gemstone</h3>

          <img
            src={result.image}
            alt={result.gemstone}
            className="gemstone-image"
          />

          <h1>💎 {result.gemstone}</h1>

          <p>
            <strong>Zodiac Sign:</strong> {result.zodiac}
          </p>

          <p>
            <strong>Concern:</strong> {result.concern}
          </p>

          <p>
            <strong>Budget:</strong> ₹{result.budget}
          </p>

          <p>
            <strong>Budget Range:</strong> {result.budgetRange}
          </p>

          <p>
            <strong>Reason:</strong> {result.reason}
          </p>

          <p>
            <strong>Concern Support:</strong> {result.concernReason}
          </p>

          <p>
            <strong>Suggested Metal:</strong> {result.metal}
          </p>

          <p>
            <strong>Wearing Day:</strong> {result.wearingDay}
          </p>

          <button className="copy-btn" onClick={copyRecommendation}>
            Copy Recommendation
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-card">
          <div className="history-header">
            <h2>Recommendation History</h2>

            <button className="clear-history-btn" onClick={clearAllHistory}>
              Clear All
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Zodiac</th>
                <th>Concern</th>
                <th>Budget</th>
                <th>Gemstone</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.zodiac}</td>
                  <td>{item.concern}</td>
                  <td>₹{item.budget}</td>
                  <td>{item.gemstone}</td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteHistoryItem(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="storage-note">
            History is saved in MongoDB Atlas through backend API.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;