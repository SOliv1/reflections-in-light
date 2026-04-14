import React from "react";


export default function SeasonalControls({
  testSeason,
  setTestSeason,
  showTestLogo,
  setShowTestLogo,
  showR,
  setShowR
}) {
  const cycleSeason = () => {
    const order = ["spring", "summer", "autumn", "winter"];
    const next = order[(order.indexOf(testSeason) + 1) % order.length];
    setTestSeason(next);
  };

  return (
    <div
    >
      <button onClick={cycleSeason}>
        Season: {testSeason || "auto"}
      </button>

      <button onClick={() => setShowTestLogo(!showTestLogo)}>
        {showTestLogo ? "Hide Logo" : "Show Logo"}
      </button>

      <button onClick={() => setShowR(!showR)}>
        {showR ? "Hide R" : "Show R"}
      </button>
    </div>
  );
}
