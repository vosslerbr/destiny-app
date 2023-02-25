import { NightfallData } from "@/global";
import useSWR from "swr";
import fetcher from "@/helpers/fetcher";
import Shields from "./Shields";
import Champions from "./Champions";
import Modifiers from "./Modifiers";
import CardLoading from "./CardLoading";
import Link from "next/link";
import { Tooltip } from "@mui/material";

export default function GrandmasterSummary() {
  const { data: nightfallData }: { data: NightfallData } = useSWR("/api/nightfall", fetcher);

  return (
    <>
      {nightfallData ? (
        <div
          className="activity-card"
          style={{
            backgroundImage: `url(https://www.bungie.net${nightfallData.keyart})`,
            border: "2px solid #ad8f1e",
          }}>
          <div className="activity-card-inner">
            <Tooltip title="View details" placement="left" arrow>
              <Link href="/grandmaster">
                <div>
                  <h3>This week&apos;s Grandmaster Nightfall is</h3>
                  <h2>{nightfallData.name}</h2>
                </div>
              </Link>
            </Tooltip>
            <Shields modifiers={nightfallData.grandmaster.modifiers} />
            <Champions modifiers={nightfallData.grandmaster.modifiers} />
            <Modifiers modifiers={nightfallData.grandmaster.modifiers} />
          </div>
        </div>
      ) : (
        <CardLoading dataName="grandmaster nightfall" />
      )}
    </>
  );
}
