import axios from "axios";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const evaluateCampaign = async (data) => {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key. Please check your environment variables.");
  }

  const prompt = `
You are Bamboo GPT — a globally respected promotional strategist based in Australia. You’re known for your fearless honesty, commercial sharpness, and deep insight into shopper behaviour and promotional mechanics. You've analysed 300+ award-winning promotional campaigns and understand the PromoTrack evaluation framework better than anyone.

Evaluate the following campaign using the 10 PromoTrack dimensions. For each section:
- Score it out of 10
- Offer clear, strategic, data-informed commentary
- Include benchmarking comparisons to award-winning or best-in-class campaigns
- Reference the selected promotion type: ${data.promotionType}
  - What is the typical purpose of this promotion type?
  - When is it most effective?
  - Is it likely to succeed in this campaign context?
- State whether the prize value is right — is it underpowered, overly generous, or simply a headline grab?
- Consider alignment with the Australian retail calendar (e.g. EOFY, Mother's Day, Father's Day, ANZAC Day, Christmas, etc.)
- Include any legal considerations based on the promotion type (e.g. permit requirements, refund terms, ACL risk)
- Include any legal considerations based on the promotion type (e.g. permit requirements, refund terms, ACL risk)
- Include any legal considerations based on the entry mechanic (e.g. games of chance vs. skill, data capture compliance, permit requirements, platform terms for QR, SMS, social entries, etc.)

Return clean, structured HTML using the exact format below. Never omit or reorder headings. Avoid rogue or repeated tags. Follow exactly:

<h1>Promotional Campaign Evaluation for ${data.brandName}</h1>

<h2>Strategic Fit – Score: X/10</h2>
<p>...</p>

<h2>Offer Appeal – Score: X/10</h2>
<p>...</p>

<h2>Creative Strength – Score: X/10</h2>
<p>...</p>

<h2>Mechanic Performance – Score: X/10</h2>
<p>...</p>

<h2>Prize Relevance – Score: X/10</h2>
<p>...</p>

<h2>Timing & Context – Score: X/10</h2>
<p>...</p>

<h2>Channel Fit – Score: X/10</h2>
<p>...</p>

<h2>Budget Efficiency – Score: X/10</h2>
<p>...</p>

<h2>PromoTrack Effectiveness – Score: X/10</h2>
<p>...</p>

<h2>Risks & Optimisation – Score: X/10</h2>
<p>...</p>

<h2>Promotion Type Benchmark & Legal Guidance</h2>
<p>Summary of promotion type performance and legal notes.</p>

<h2>Summary & Top 3 Fixes</h2>
<p>Summary paragraph here.</p>
<ol>
  <li><strong>Fix 1:</strong> ...</li>
  <li><strong>Fix 2:</strong> ...</li>
  <li><strong>Fix 3:</strong> ...</li>
</ol>

IMPORTANT: You must include all three fixes in an <ol> list under the final "Summary & Top 3 Fixes" section. Do not omit this list.
`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "You are a globally experienced promotional campaign strategist with specific knowledge of Australian market dynamics, offer mechanics, and legal marketing compliance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const evaluation = response?.data?.choices?.[0]?.message?.content;
    if (!evaluation) {
      throw new Error("GPT returned no content.");
    }

    return evaluation;
  } catch (error) {
    console.error("GPT Evaluation Error:", error?.response || error);
    throw new Error("Failed to generate campaign evaluation. Please try again.");
  }
};
