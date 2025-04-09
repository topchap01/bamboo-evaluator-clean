import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica", lineHeight: 1.6 },
  title: { fontSize: 20, marginBottom: 16, textAlign: "center", fontWeight: "bold" },
  sectionHeader: { fontSize: 14, marginBottom: 6, fontWeight: "bold" },
  textBlock: { marginBottom: 10 },
  fixListItem: { marginBottom: 4 },
});

// Strip unwanted HTML tags but keep <h1>, <h2>, <p>, <ol>, <li>, <strong>
const cleanHtml = (html) => {
  return html.replace(/<[^>]*>/g, (tag) => {
    return /^(<\/?(h1|h2|p|ol|li|strong)>)/i.test(tag) ? tag : "";
  }).replace(/\s+/g, " ").trim();
};

// Parse cleaned GPT HTML to extract sections, summary, and fixes
const parseHtml = (html) => {
  const cleanedHtml = cleanHtml(html);
  const sectionRegex = /<h2>(.*?)<\/h2>\s*<p>(.*?)<\/p>/gs;
  const sections = [...cleanedHtml.matchAll(sectionRegex)].map(([_, heading, content]) => ({ heading, content }));

  const summaryMatch = cleanedHtml.match(/<h2>Summary & Top 3 Fixes<\/h2>\s*<p>(.*?)<\/p>/s);
  const summary = summaryMatch ? summaryMatch[1].trim() : null;

  const olMatch = cleanedHtml.match(/<ol>([\s\S]*?)<\/ol>/i);
  let topFixes = [];

  if (olMatch) {
    topFixes = [...olMatch[1].matchAll(/<li><strong>(.*?)<\/strong>:\s*(.*?)<\/li>/g)]
      .map(([, what, why]) => `${what.trim()}: ${why.trim()}`);
  } else {
    const fallback = cleanedHtml.split(/<h2>Summary & Top 3 Fixes<\/h2>/i)[1] || "";
    const plainFixes = [...fallback.matchAll(/\d+\.\s+(.*?)(?=(\d+\.\s|<\/|$))/gs)]
      .map(m => m[1].trim())
      .filter(Boolean);

    if (plainFixes.length === 3) {
      topFixes = plainFixes.map((line) => {
        const [what, ...why] = line.split(/[:\-]\s*/);
        return `${what.trim()}: ${why.join(" - ").trim()}`;
      });
    }
  }

  return { sections, summary, topFixes };
};

// PDF Content Structure
const PdfReport = ({ formData, evaluationText }) => {
  const { sections, summary, topFixes } = parseHtml(evaluationText);

  const introPage = (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Bamboo Campaign Submission</Text>
      {["brandName", "objective", "targetAudience", "offerType", "offer", "creativeHeadline", "entryMechanic", "prizeDetails", "mediaChannels", "mediaBudget", "startDate", "endDate"].map((field) => (
        <View key={field} style={styles.textBlock}>
          <Text style={{ fontWeight: "bold" }}>{field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}:</Text>
          <Text>{formData[field]}</Text>
        </View>
      ))}
    </Page>
  );

  const evaluationPage = (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Campaign Evaluation</Text>
      {sections.map((section, i) => (
        <View key={i} style={{ marginBottom: 16 }}>
          <Text style={styles.sectionHeader}>{section.heading}</Text>
          <Text>{section.content}</Text>
        </View>
      ))}
    </Page>
  );

  const summaryPage = (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Summary & Top 3 Fixes</Text>
      {summary && (
        <>
          <Text style={styles.sectionHeader}>Summary</Text>
          <Text>{summary}</Text>
        </>
      )}
      {topFixes.length > 0 ? (
        <>
          <Text style={styles.sectionHeader}>Top 3 Fixes</Text>
          {topFixes.map((fix, i) => (
            <Text key={i} style={styles.fixListItem}>{i + 1}. {fix}</Text>
          ))}
        </>
      ) : (
        <Text>Top 3 Fixes not provided. Please refer to summary above.</Text>
      )}
    </Page>
  );

  return <Document>{introPage}{evaluationPage}{summaryPage}</Document>;
};

export default PdfReport;

// Button Component
export const PdfDownloadButton = ({ formData, evaluationText }) => (
  <PDFDownloadLink
    document={<PdfReport formData={formData} evaluationText={evaluationText} />}
    fileName={`Bamboo_Evaluation_${formData.brandName || "Campaign"}.pdf`}
    style={{
      marginTop: "1rem",
      padding: "0.5rem 1rem",
      backgroundColor: "#1976D2",
      color: "white",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: "bold"
    }}
  >
    📄 Download Beautiful PDF
  </PDFDownloadLink>
);
