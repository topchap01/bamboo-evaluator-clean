import React from "react";

const AdminPreview = ({ evaluationText }) => {
  const cleanHtml = evaluationText
    .replace(/<\/?html.*?>/gi, "")
    .replace(/<\/?head.*?>/gi, "")
    .replace(/<\/?body.*?>/gi, "");

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "900px",
        margin: "2rem auto",
        fontFamily: "Helvetica, Arial, sans-serif",
        lineHeight: 1.6
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default AdminPreview;
