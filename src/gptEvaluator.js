import axios from 'axios';

const OPENAI_API_KEY = "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"; // Secure this key in env in production

export const evaluateCampaign = async (formData) => {
  const prompt = `
You are Bamboo GPT — a senior global campaign strategist with advanced expertise in promotional effectiveness, shopper psychology, retail channel dynamics, media ROI, and behavioural economics. You are fluent in PromoTrack evaluation frameworks and know how to turn campaign ideas into measurable commercial wins.

Evaluate the promotional campaign below. Be smart, fast, and commercially focused. Deliver insight with precision — no fluff, no filler.

🧠 CAMPAIGN DETAILS
- 🎯 Objective: ${formData.objective}
- 👥 Target Audience: ${formData.targetAudience}
- 🎁 Offer: ${formData.offer}
- 🎨 Creative Hook: ${formData.creativeHeadline}
- 📲 Entry Mechanic: ${formData.entryMechanic}
- 🏆 Prize Info: ${formData.prizeDetails}
- 💰 Budget: ${formData.mediaBudget || "Not specified"}
- 📡 Channels: ${formData.mediaChannels}
- 🗓️ Timing: ${formData.startDate} to ${formData.endDate}
- 📆 Calendar Dates: ${formData.startDate} – ${formData.endDate}

📋 EVALUATION FORMAT (Max 700 words)

1. **Strategic Fit** – Does the campaign align with brand and business objectives?
2. **Offer Appeal** – Is the offer compelling for the audience and the category?
3. **Creative Strength** – How effective is the hook? Does it stand out?
4. **Mechanic Performance** – Is the mechanic intuitive, motivating, and mobile-friendly?
5. **Prize Relevance** – Is the prize appealing and relevant to both the brand and audience?
6. **Timing & Context** – Is the timing smart? Does it match seasonal or cultural moments?
7. **Channel Fit** – Are the chosen media channels appropriate and activated smartly?
8. **Budget Efficiency** – Is the budget being spent in ways likely to drive ROI?
9. **PromoTrack Effectiveness** – How well would this campaign score against top 200 benchmarks?
10. **Risks & Optimisation** – What could go wrong? What would make this even stronger?

Tone: Sharp, strategic, bold and honest — with a dash of cheek and humour when deserved. Write as if you're advising a time-poor brand manager looking for useful truth, not a pat on the back.
Consider key Australian calendar dates and believe that most of the campaigns will be Australian.
Use bullet points, avoid waffle, and speak like you’ve seen thousands of campaigns.
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a promotional campaign strategist." },
        { role: "user", content: prompt }
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

  return response.data.choices[0].message.content;
};
