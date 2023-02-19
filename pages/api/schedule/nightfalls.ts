import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import dayjs from "dayjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  const nightfallOrder = fs.readFileSync(process.cwd() + "/json/NightfallOrderS19.json", "utf8");

  const nightfallOrderJson = JSON.parse(nightfallOrder);

  const initialDate = dayjs().subtract(1, "week").set("day", 2).startOf("day").add(11, "hour"); // last tuesday

  console.log(initialDate.format("MM/DD/YYYY HH:mm:ss"));

  const lastDayOfSeason = dayjs("02/27/2023 11:00:00", "MM/DD/YYYY HH:mm:ss");

  // this how many resets we have in the season
  const numberOfWeeks = lastDayOfSeason.diff(initialDate, "week");

  // this is the schedule we will build
  const schedule: { [key: string]: any } = {};

  // starting index for nightfall
  let nightfallIndex = 4;

  // loop through each day of the season
  for (let i = 0; i <= numberOfWeeks; i++) {
    const resetTimestamp =
      dayjs().subtract(1, "week").set("day", 2).startOf("day").add(11, "hour").unix() + 604800 * i;

    // ends 1 week after reset
    const endTimestamp = resetTimestamp + 604800;

    const nightfall = nightfallOrderJson[nightfallIndex];

    if (nightfallIndex === 5) {
      nightfallIndex = 0;
    } else {
      nightfallIndex++;
    }

    schedule[resetTimestamp] = {
      ...nightfall,
      startsAt: resetTimestamp,
      endsAt: endTimestamp,
    };
  }

  fs.writeFileSync(process.cwd() + "/json/nightfallSchedule.json", JSON.stringify(schedule));

  res.status(200).send("ok");
}
