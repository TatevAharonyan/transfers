import React from "react";

function ResultCard({ title, text }) {
  return (
    <p>
      <b>{title}</b> {text}
    </p>
  );
}

export default ResultCard;
