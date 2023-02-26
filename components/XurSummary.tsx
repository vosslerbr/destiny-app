import { useEffect, useState } from "react";
import dayjs from "dayjs";
import XurExotics from "./XurExotics";
import XurQuestExotics from "./XurQuestExotics";
import XurLegendaryWeapons from "./XurLegendaryWeapons";
import XurLegendaryArmor from "./XurLegendaryArmor";
import CardLoading from "./CardLoading";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { Tooltip } from "@mui/material";

dayjs.extend(utc);

const resetTime = dayjs
  .utc()
  .set("hour", 17)
  .set("minute", 0)
  .set("second", 0)
  .local()
  .format("hh:mm a");

export default function XurSummary() {
  const [xurIsHere, setXurIsHere] = useState<boolean>(false);
  const [xurData, setXurData] = useState<any>(null);
  const [xurArrival, setXurArrival] = useState<string>("");

  useEffect(() => {
    // TODO try catch?

    const getXurData = async () => {
      const res = await fetch("/api/xur");
      const data = await res.json();

      setXurData(data);
    };

    // xur is only around from Friday reset to Tuesday reset
    const now = dayjs.utc();

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
            <Tooltip title="View details" placement="left" arrow>
              <Link href="/xur">
                <div>
                  <h3>Leaves Tuesday at {resetTime}</h3>
                  <h2>{xurData.xur.name}</h2>
                </div>
              </Link>
            </Tooltip>

            <XurExotics items={xurData.items} />
            <XurQuestExotics items={xurData.items} />
            <XurLegendaryWeapons items={xurData.items} />
            <XurLegendaryArmor items={xurData.items} />
          </div>
        </div>
      ) : (
        // TODO loading component
        <CardLoading dataName="Xur's inventory" />
      )}
    </>
  );
}
