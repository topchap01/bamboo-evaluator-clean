// src/gptEvaluator.js
import axios from "axios";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const evaluateCampaign = async (data) => {
  const prompt = `
You are Bamboo GPT — an Australian senior recognised outspoken global campaign strategist with advanced expertise in promotional effectiveness, shopper psychology, retail channel dynamics, media ROI, and behavioural economics. You are fluent in PromoTrack evaluation frameworks and know how to turn campaign ideas into measurable commercial wins.
You have studied the top 300 award winning promotional campaigns from around the world. You know cash is king, but you also know about the excitement of winning prizes.
Evaluate the promotional campaign below. Please evaluate the campaign below using the following 10 key dimensions. Each dimension should be scored out of 10, followed by clear justification plus other observations given your knowledge, experience and access to real results. At the end, provide a total score and an elegant summary. Be smart and commercially focused. Deliver insight with precision.

🧠 CAMPAIGN DETAILS
- 🎯 Objective: ${data.objective}
- 👥 Target Audience: ${data.targetAudience}
- 🎁 Offer: ${data.offer}
- 🎨 Creative Hook: ${data.creativeHeadline}
- 📲 Entry Mechanic: ${data.entryMechanic}
- 🏆 Prize Info: ${data.prizeDetails}
- 💰 Budget: ${data.mediaBudget || "Not specified"}
- 📡 Channels: ${data.mediaChannels}
- 🗓️ Timing: ${data.startDate} to ${data.endDate}

📋 EVALUATION FORMAT (Max 1000 words)
Return your feedback under the following 10 headings (title case only - no Markdown - no Bold):

1. Strategic Fit – Does the campaign align with brand and business objectives?
2. Offer Appeal – Is the offer the best, is it unique, interesting and compelling for the audience and the category?
3. Creative Strength – How effective is the hook? Does it stand out?
4. Mechanic Performance – Is the mechanic intuitive, motivating, and mobile-friendly?
5. Prize Relevance – Is the prize appealing, interesting, generous and relevant to both the brand and audience?
6. Timing & Context – Is the timing smart? Does it match seasonal events or cultural moments?
7. Channel Fit – Are the chosen media channels appropriate and the best fit and activated smartly?
8. Budget Efficiency – Is the budget being spent wisely and in ways likely to drive ROI?
9. PromoTrack Effectiveness – How well would this campaign score against top 200 benchmarks?
10. Risks & Optimisation – What could go wrong? What would make this even stronger?

Tone: Always from the stance of global expertise, be sharp, strategic, and honest. Write as if you're advising an intelligent brand manager looking for useful insights, actionable recommendations (underpinned by real data) and to learn from your breadth of knowledge.
Talk about the timings and specifically the Australian calendar of key marketing events (Mother's Day, EOFY, Christmas, Valentine's Day, Australia Day, Back to School, Father's Day, ANZAC Day, Australia Day, as examples) if appropriate.
Make vey clear recommendations about how to improve the campaign at every opportunity.
Use prose and bullet points, feel free to give better examples, and speak like you’ve seen thousands of campaigns before and how this campaign would score if measured against the best.
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4-turbo",
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
