import LSChampions from "@/components/LSChampions";
import LSModifiers from "@/components/LSModifiers";
import LSRewards from "@/components/LSRewards";
import LSShields from "@/components/LSShields";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import Head from "next/head";
import { useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";
import useSWR from "swr";
import { LostSectorData, NightfallData } from "@/global";
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
  const { data: lostSectorData }: { data: LostSectorData; isLoading: boolean } = useSWR(
    "/api/lost-sector",
    fetcher
  );
  const { data: nightfallData }: { data: NightfallData } = useSWR("/api/nightfall", fetcher);

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

    console.log(now.day());

    const friday = 5;
    const tuesday = 2;

    const weekend = [6, 0, 1];

    if (weekend.includes(now.day())) {
      setXurIsHere(true);
      getXurData();

      return;
    }

    if ((now.day() === friday && now.hour() >= 17) || (now.day() === tuesday && now.hour() < 17)) {
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
          <div className="activity-card">
            <div className="loading-container">
              <h2>Loading Lost Sector Data...</h2>
              <LinearProgress />
            </div>
          </div>
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
          <div className="activity-card">
            <div className="loading-container">
              <h2>Loading Xur&apos;s Inventory...</h2>
              <LinearProgress />
            </div>
          </div>
        )}

        {nightfallData ? (
          <div
            className="activity-card"
            style={{
              backgroundImage: `url(https://www.bungie.net${nightfallData.keyart})`,
            }}>
            <div className="activity-card-inner">
              <div>
                <h3>This week&apos;s Nightfall is</h3>
                <h2>{nightfallData.name}</h2>
              </div>

              {/* we only need these once, so just grab from master */}
              <LSShields modifiers={nightfallData.difficulties[3].modifiers} />
              <LSChampions modifiers={nightfallData.difficulties[3].modifiers} />

              {nightfallData.difficulties.map((difficulty: any) => {
                return (
                  <div key={difficulty.detailedName}>
                    <Accordion
                      sx={{
                        backgroundColor: "transparent",
                        color: "rgba(255, 255, 255, 0.5)",
                        boxShadow: "none",
                      }}>
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon
                            sx={{
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          />
                        }
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                          border: "none",
                          paddingLeft: "0rem",
                        }}>
                        <Typography>{difficulty.detailedName} Modifiers</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <LSModifiers modifiers={difficulty.modifiers} showTitle={false} />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="activity-card">
            <div className="loading-container">
              <h2>Loading Nightfall Data...</h2>
              <LinearProgress />
            </div>
          </div>
        )}

        {nightfallData ? (
          <div
            className="activity-card"
            style={{
              backgroundImage: `url(https://www.bungie.net${nightfallData.keyart})`,
              border: "2px solid #ad8f1e",
            }}>
            <div className="activity-card-inner">
              <div>
                <h3>This week&apos;s Grandmaster Nightfall is</h3>
                <h2>{nightfallData.name}</h2>
              </div>

              <LSShields modifiers={nightfallData.grandmaster.modifiers} />
              <LSChampions modifiers={nightfallData.grandmaster.modifiers} />
              <LSModifiers modifiers={nightfallData.grandmaster.modifiers} />
            </div>
          </div>
        ) : (
          <div className="activity-card">
            <div className="loading-container">
              <h2>Loading Grandmaster Nightfall Data...</h2>
              <LinearProgress />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
