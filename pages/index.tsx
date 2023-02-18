import LSChampions from "@/components/LSChampions";
import LSModifiers from "@/components/LSModifiers";
import LSRewards from "@/components/LSRewards";
import LSShields from "@/components/LSShields";
import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import { useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";
import useSWR from "swr";
import { LostSectorData } from "@/global";
import XurLegendaryWeapons from "@/components/XurLegendaryWeapons";
import XurExotics from "@/components/XurExotics";
import XurQuestExotics from "@/components/XurQuestExotics";
import XurLegendaryArmor from "@/components/XurLegendaryArmor";

dayjs.extend(utc);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const resetTime = dayjs
  .utc()
  .set("hour", 17)
  .set("minute", 0)
  .set("second", 0)
  .local()
  .format("hh:mm a");

export default function Home() {
  // const [lostSectorData, setLostSectorData] = useState<any>(null);

  const { data: lostSectorData }: { data: LostSectorData } = useSWR("/api/lost-sector", fetcher);

  const [xurIsHere, setXurIsHere] = useState<boolean>(false);
  const [xurData, setXurData] = useState<any>(null);
  const [xurArrival, setXurArrival] = useState<string>("");

  useEffect(() => {
    // TODO try catch?

    const getXurData = async () => {
      const res = await fetch("/api/xur");
      const data = await res.json();

      console.log(data);

      setXurData(data);
    };

    // xur is only around from Friday reset to Tuesday reset
    const now = dayjs.utc();

    const friday = 5;
    const tuesday = 2;

    // reset is 17:00 UTC
    const fridayReset = dayjs.utc().set("day", friday).hour(17).minute(0).second(0);
    const tuesdayReset = dayjs
      .utc()
      .set("day", tuesday)
      .hour(17)
      .minute(0)
      .second(0)
      .add(now.day() === 0 ? 0 : 1, "week"); // if today is sunday, it's a new week and we don't need to add 1 week

    // if now is after friday reset and before tuesday reset, xur is here
    if (dayjs(now).isAfter(fridayReset) && dayjs(now).isBefore(tuesdayReset)) {
      setXurIsHere(true);
      getXurData();

      return;
    }

    const interval = setInterval(() => {
      const diffInDays = dayjs
        .utc()
        .set("day", 5)
        .hour(17)
        .minute(0)
        .second(0)
        .diff(dayjs.utc(), "days", true);

      const days = Math.floor(diffInDays);
      const hours = Math.floor((diffInDays - days) * 24);
      const minutes = Math.floor(((diffInDays - days) * 24 - hours) * 60);
      const seconds = Math.floor((((diffInDays - days) * 24 - hours) * 60 - minutes) * 60);

      const daysPlural = days === 1 ? "" : "s";
      const hoursPlural = hours === 1 ? "" : "s";
      const minutesPlural = minutes === 1 ? "" : "s";
      const secondsPlural = seconds === 1 ? "" : "s";

      const time = `${days} day${daysPlural}, ${hours} hour${hoursPlural}, ${minutes} minute${minutesPlural}, ${seconds} second${secondsPlural}`;

      setXurArrival(time);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Destiny App</title>
        <meta name="description" content="Destiny Lost Sector App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {lostSectorData ? (
          <div
            className="activity-card"
            style={{
              backgroundImage: `url(https://www.bungie.net${lostSectorData.keyArt})`,
            }}>
            <div className="activity-card-inner">
              <div>
                <h3>Today&apos;s Lost Sector is</h3>
                <h2>{lostSectorData.name}</h2>
              </div>

              <LSRewards rewards={lostSectorData.rewards} />
              <LSShields modifiers={lostSectorData.modifiers} />
              <LSChampions modifiers={lostSectorData.modifiers} />
              <LSModifiers modifiers={lostSectorData.modifiers} />
            </div>
          </div>
        ) : (
          // TODO loading component
          <CircularProgress />
        )}

        {!xurIsHere ? (
          <div className="xur-card">
            <h2>Xur will be back at {resetTime} on Friday</h2>
            <h3>{xurArrival} from now</h3>
          </div>
        ) : xurData && xurIsHere ? (
          <div
            className="activity-card"
            style={{
              backgroundImage: `url(https://www.bungie.net${xurData.xur.keyart})`,
            }}>
            <div className="activity-card-inner">
              <div>
                <h3>Leaves Tuesday at {resetTime}</h3>
                <h2>{xurData.xur.name}</h2>
              </div>

              <XurExotics items={xurData.items} />
              <XurQuestExotics items={xurData.items} />
              <XurLegendaryWeapons items={xurData.items} />
              <XurLegendaryArmor items={xurData.items} />
            </div>
          </div>
        ) : (
          // TODO loading component
          <CircularProgress />
        )}
      </main>
    </>
  );
}
