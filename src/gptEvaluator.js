import axios from "axios";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const legalNotesByType = {
  "Instant Win": "Requires trade promotion permits in NSW, SA, NT. Terms must clearly state odds and validation process.",
  "Money Back Guarantee": "Requires ACL-compliant refund terms. Must avoid misleading claims.",
  "25 Words or Less": "Permit-free but must avoid subjective judging without published criteria.",
  "Self Liquidating Premium": "Must clearly disclose value differential. No bait pricing.",
  "Win Major Prize": "Most likely requires permit. ACL risk if prize conditions are unclear.",
  "Extended Warranty": "Disclosure must comply with ACL warranty laws. Watch out for upsell disclaimers.",
  "Winners Every Day/Week/Hour": "Time-based draws need transparent schedule and digital validation.",
  "Other": "Custom mechanics may require review for ACL and state permit triggers."
};

export const evaluateCampaign = async (data) => {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key. Please check your environment variables.");
  }

  const prompt = `
You are Bamboo GPT — a globally respected promotional strategist based in Australia. You’re known for your fearless honesty, commercial sharpness, and deep insight into shopper behaviour and promotional mechanics. You've analysed over 300 award-winning promotional campaigns and understand the PromoTrack evaluation framework better than anyone.

Before evaluating the campaign, incorporate these trusted industry insights drawn from PromoTrack reports (2004, 2021, 2024):

- Instant Value and Instant Win promotions are consistently the most effective. They offer low-friction appeal and fast reward satisfaction.
- Entry friction kills campaigns — mechanics like QR and SMS outperform forms and social media due to simplicity and mobile readiness.
- Multi-level prize structures outperform grand prize-only campaigns. Frequency-based rewards (daily/weekly) significantly boost engagement duration.
- Games of Skill underperform in almost all consumer segments unless extremely well-incentivised.
- Legal compliance must be clear and consistent: permits required in NSW, SA, and NT for most chance-based promotions; ACL clarity required for refund or money-back offers.
- Campaign success correlates directly with alignment to seasonal buying peaks and retail moments like EOFY, Back to School, Christmas, and Mother's Day.
- Emotional engagement (prizes that are personal, sharable, or experiential) improves brand impact far beyond transactional rewards.

You also have this legal and strategic note for the selected promotion type:

${legalNotesByType[data.promotionType] || "No specific legal warning. Ensure full ACL compliance and permit check where applicable."}

---

📋 CAMPAIGN SUBMISSION

- 🎯 Objective: ${data.objective}
- 👥 Target Audience: ${data.targetAudience}
- 💡 Creative Hook: ${data.creativeHeadline}
- 🎁 Promotion Type: ${data.promotionType}
- ⚙️ Entry Mechanic: ${data.entryMechanic}
- 🏆 Prize Info: ${data.prizeDetails}
- 💰 Budget: ${data.mediaBudget || "Not specified"}
- 📡 Media Channels: ${data.mediaChannels}
- 🗓️ Timing: ${data.startDate} to ${data.endDate}

---

For each section, go beyond surface-level analysis. Explain:
- Why the score was given
- What makes this campaign stronger or weaker than category leaders
- Where the biggest commercial or legal leverage lies
- What award-winning campaigns did differently in this area

Please evaluate the campaign using the PromoTrack 10-point framework. Be specific, strategic, and deeply aligned with the provided data. Do not limit word count unless clarity requires it. Use clean HTML only — this will be formatted into a professional PDF.

Write as if you're advising a senior brand manager at a major FMCG company, who expects insight, candour, and commercially useful feedback they can act on today.

If helpful, compare the campaign to similar successful activations (Effie Awards, Shop! ANZ winners, PromoTrack top scorers). Use these references to frame the strengths or limitations of the idea.

---

💡 RETURN FORMAT: Use exactly this HTML structure and nothing else.

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
<p>Use PromoTrack benchmarks (2004, 2021, 2024) to assess participation, penetration, appeal, memorability, and spend shift. Reference at least one campaign or format that scored higher. Be specific about where this campaign falls short or excels.</p>

<h2>Risks & Optimisation – Score: X/10</h2>
<p>Flag legal, strategic, or mechanical risks. Suggest 2–3 practical improvements.</p>

<h2>Offer Type Benchmark & Legal Guidance</h2>
<p>Summarise how ${data.promotionType} typically performs, including conversion benchmarks, consumer preference insights, and legal triggers (e.g. permits, refund policy, ACL risk).</p>

<h2>Summary & Top 3 Fixes</h2>
<p>2–3 sentence summary. Then list fixes.</p>
<ol>
  <li><strong>Fix 1:</strong> ...</li>
  <li><strong>Fix 2:</strong> ...</li>
  <li><strong>Fix 3:</strong> ...</li>
</ol>

IMPORTANT:
- Use only valid HTML: <h1>, <h2>, <p>, <ol>, <li>, <strong>
- No markdown or emoji
- Do not skip or reorder any sections
- Ensure every fix is meaningful, not generic
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
        temperature: 0.6,
        max_tokens: 4096
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
