import Champions from "@/components/Champions";
import Modifiers from "@/components/Modifiers";
import RewardsDetail from "@/components/RewardsDetail";
import Shields from "@/components/Shields";
import { LostSectorData } from "@/global";
import fetcher from "@/helpers/fetcher";
import { CircularProgress } from "@mui/material";
import useSWR from "swr";

export default function LostSectorDetail() {
  const { data: lostSectorData }: { data: LostSectorData; isLoading: boolean } = useSWR(
    "/api/lost-sector",
    fetcher
  );

  return (
    <main>
      {lostSectorData ? (
        <>
          <div
            className="activity-card-detail"
            style={{
              backgroundImage: `url(https://www.bungie.net${lostSectorData.keyArt})`,
            }}>
            <div className="activity-card-inner">
              <div>
                <h1>{lostSectorData.name}</h1>
                <h2>Location, Place</h2>
              </div>

              <Shields modifiers={lostSectorData.modifiers} />
              <Champions modifiers={lostSectorData.modifiers} />
              <Modifiers modifiers={lostSectorData.modifiers} />
            </div>
          </div>
          <RewardsDetail rewards={lostSectorData.rewards} />
        </>
      ) : (
        <CircularProgress />
      )}
    </main>
  );
}
