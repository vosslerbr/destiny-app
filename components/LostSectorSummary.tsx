import { LostSectorData } from "@/global";
import CardLoading from "./CardLoading";
import Champions from "./Champions";
import Modifiers from "./Modifiers";
import Rewards from "./Rewards";
import Shields from "./Shields";
import useSWR from "swr";
import fetcher from "@/helpers/fetcher";
import Link from "next/link";
import { Tooltip } from "@mui/material";

export default function LostSectorSummary() {
  const { data: lostSectorData }: { data: LostSectorData; isLoading: boolean } = useSWR(
    "/api/lost-sector",
    fetcher
  );

  return (
    <>
      {lostSectorData ? (
        <div
          className="activity-card"
          style={{
            backgroundImage: `url(https://www.bungie.net${lostSectorData.keyArt})`,
          }}>
          <div className="activity-card-inner">
            {" "}
            <Tooltip title="View details" placement="left" arrow>
              <Link href="/lost-sector">
                <div>
                  <h3>Today&apos;s Lost Sector is</h3>
                  <h2>{lostSectorData.name}</h2>
                </div>
              </Link>
            </Tooltip>
            <Rewards rewards={lostSectorData.rewards} />
            <Shields modifiers={lostSectorData.modifiers} />
            <Champions modifiers={lostSectorData.modifiers} />
            <Modifiers modifiers={lostSectorData.modifiers} />
          </div>
        </div>
      ) : (
        <CardLoading dataName="lost sector" />
      )}
    </>
  );
}
