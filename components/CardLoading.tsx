/**
 * @description Displays a loading card with a progress bar
 */

import { LinearProgress } from "@mui/material";

export default function CardLoading({ dataName }: { dataName: string }) {
  return (
    <div className="section-card">
      <div className="loading-container">
        <h2>Loading {dataName}...</h2>
        <LinearProgress />
      </div>
    </div>
  );
}
