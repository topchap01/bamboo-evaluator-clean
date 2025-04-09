import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font
} from "@react-pdf/renderer";

// Optional: custom font registration
// Font.register({ family: 'Inter', src: 'https://...' })

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    backgroundColor: "#FAFAFA"
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1976D2"
  },
  sectionHeader: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#444"
  },
  textBlock: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: 4
  },
  label: {
    fontWeight: "bold",
    color: "#333"
  },
  scoreBox: {
    marginTop: 10,
    padding: 6,
    backgroundColor: "#E3F2FD",
    borderRadius: 4,
    fontSize: 12,
    textAlign: "right",
    fontWeight: "bold",
    color: "#1976D2"
  }
});

const PdfReport = ({ formData, evaluationText }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>📋 Bamboo Campaign Evaluation</Text>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Brand Name:</Text>
        <Text>{formData.brandName}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Objective:</Text>
        <Text>{formData.objective}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Target Audience:</Text>
        <Text>{formData.targetAudience}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Offer:</Text>
        <Text>{formData.offer}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Creative Hook:</Text>
        <Text>{formData.creativeHeadline}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Entry Mechanic:</Text>
        <Text>{formData.entryMechanic}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Prize Details:</Text>
        <Text>{formData.prizeDetails}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Channels:</Text>
        <Text>{formData.mediaChannels}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Budget:</Text>
        <Text>{formData.mediaBudget}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Timing:</Text>
        <Text>{formData.startDate} to {formData.endDate}</Text>
      </View>

      <Text style={styles.sectionHeader}>Campaign Evaluation</Text>
      <View style={styles.textBlock}>
        <Text>{evaluationText}</Text>
      </View>

      <Text style={styles.scoreBox}>⭐ Overall PromoTrack Score: 7.8 / 10</Text>
    </Page>
  </Document>
);

export const PdfDownloadButton = ({ formData, evaluationText }) => (
  <PDFDownloadLink
    document={<PdfReport formData={formData} evaluationText={evaluationText} />}
    fileName={`Bamboo_Evaluation_${formData.brandName}.pdf`}
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
