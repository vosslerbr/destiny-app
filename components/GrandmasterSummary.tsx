import { NightfallData } from "@/global";
import useSWR from "swr";
import fetcher from "@/helpers/fetcher";
import Shields from "./Shields";
import Champions from "./Champions";
import Modifiers from "./Modifiers";
import CardLoading from "./CardLoading";
import Link from "next/link";
import { Tooltip } from "@mui/material";
import dayjs from "dayjs";

export default function GrandmasterSummary() {
  const { data: nightfallData }: { data: NightfallData } = useSWR("/api/nightfall", fetcher);

  // GMs don't start til April 11 this season
  const nowTimestamp = dayjs.unix(dayjs().unix()).unix();

  // reset is 17:00 UTC on April 11
  const resetTimestamp = dayjs.unix(dayjs("2023-04-11T17:00:00Z").unix()).unix();

  console.log("nowTimestamp: ", nowTimestamp);
  console.log("resetTimestamp: ", resetTimestamp);

  if (nowTimestamp < resetTimestamp) {
    return (
      <div
        className="out-of-session-card"
        style={{
          border: "2px solid #ad8f1e",
        }}>
        <h2>Grandmaster Nightfalls</h2>
        <h3>Starting April 11, 2023</h3>
      </div>
    );
  }

  return (
    <>
      {nightfallData ? (
        <div
          className="section-card"
          style={{
            backgroundImage: `url(https://www.bungie.net${nightfallData.keyart})`,
            border: "2px solid #ad8f1e",
          }}>
          <div className="section-card-inner">
            <Tooltip title="View details" placement="left" arrow>
              <Link href="/grandmaster">
                <div>
                  <h3>This week&apos;s Grandmaster Nightfall is</h3>
                  <h2>{nightfallData.name}</h2>
                </div>
              </Link>
            </Tooltip>
            <Shields modifiers={nightfallData.grandmaster?.activity.modifiers || []} />
            <Champions modifiers={nightfallData.grandmaster?.activity.modifiers || []} />
            <Modifiers modifiers={nightfallData.grandmaster?.activity.modifiers || []} />
          </div>
        </div>
      ) : (
        <CardLoading dataName="grandmaster nightfall" />
      )}
    </>
  );
}
