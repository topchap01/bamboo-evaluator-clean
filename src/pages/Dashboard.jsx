import { useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { evaluateCampaign } from "../gptEvaluator";
import { downloadServerPdf } from "../utils/downloadServerPdf";

function Dashboard() {
  const [formData, setFormData] = useState({
    brandName: "",
    objective: "",
    targetAudience: "",
    promotionType: "",
    creativeHeadline: "",
    entryMechanic: "",
    prizeDetails: "",
    mediaBudget: "",
    mediaChannels: "",
    startDate: "",
    endDate: "",
  });

  const [evaluation, setEvaluation] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEvaluation("⏳ Evaluating campaign...");

    try {
      const response = await evaluateCampaign(formData);
      setEvaluation(response);

      const auth = getAuth();
      const user = auth.currentUser;
      await addDoc(collection(db, "campaignEvaluations"), {
        userId: user ? user.uid : null,
        email: user ? user.email : "anonymous",
        formData,
        evaluation: response,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("🔥 Error during evaluation or save:", err);
      setEvaluation("⚠️ Something went wrong. Please try again.");
    }
  };

  if (hasError) {
    return <div>Something went wrong, please try again later.</div>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Submit A Campaign</h2>

        {Object.keys(formData).map((field) => {
          if (field === "promotionType") {
            return (
              <div key={field} style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", marginBottom: ".5rem", fontWeight: "bold" }}>
                  Promotion Type
                </label>
                <select
                  name="promotionType"
                  value={formData.promotionType}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem"
                  }}
                  required
                >
                  <option value="">Select a promotion type</option>
                  <optgroup label="Prize-Based Promotions">
                    <option value="Win Major Prize">Win Major Prize</option>
                    <option value="Winners Every Day / Week / Hour">Winners Every Day / Week / Hour</option>
                    <option value="Instant Win">Instant Win</option>
                    <option value="Win $1m">Win $1m</option>
                  </optgroup>
                  <optgroup label="Value-Based Promotions">
                    <option value="Cashback">Cashback</option>
                    <option value="Gift With Purchase (GWP)">Gift With Purchase (GWP)</option>
                    <option value="Bundle">Bundle</option>
                    <option value="Price Discount">Price Discount</option>
                    <option value="Sampling">Sampling</option>
                  </optgroup>
                  <optgroup label="Risk-Based or Reinforcement">
                    <option value="Self-Liquidating Premium">Self-Liquidating Premium</option>
                    <option value="Extended Warranty">Extended Warranty</option>
                    <option value="Money Back Guarantee">Money Back Guarantee</option>
                  </optgroup>
                  <option value="Other...please specify">Other...please specify</option>
                </select>
              </div>
            );
          }

          return (
            <div key={field} style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: ".5rem", fontWeight: "bold" }}>
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
              </label>
              <input
                type={field.toLowerCase().includes("date") ? "date" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
                required
              />
            </div>
          );
        })}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "#1976D2",
            color: "#fff",
            fontSize: "1rem",
            border: "none",
            borderRadius: "8px",
          }}
        >
          🎯 Evaluate Campaign
        </button>
      </form>

      {evaluation && (
        <>
          <h3 style={{ textAlign: "center", marginTop: "2rem" }}>🧠 Campaign Evaluation</h3>

          <div id="pdf-content">
            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "1.5rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                lineHeight: "1.6",
                fontSize: "0.95rem",
              }}
              dangerouslySetInnerHTML={{ __html: evaluation }}
            />
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => downloadServerPdf({ formData, evaluationHtml: evaluation })}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.25rem",
                backgroundColor: "#2E7D32",
                color: "white",
                fontSize: "1rem",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              📄 Download Evaluation (Server PDF)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
