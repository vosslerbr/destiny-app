import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import dayjs from "dayjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  const armorOrder = [
    "Exotic Helmet",
    "Exotic Leg Armor",
    "Exotic Gauntlets",
    "Exotic Chest Armor",
  ];

  const lostSectorOrder = fs.readFileSync(process.cwd() + "/json/LostSectorOrder.json", "utf8");

  const lostSectorOrderJson = JSON.parse(lostSectorOrder);

  const startDate = dayjs().startOf("day").add(11, "hour");
  const lastDayOfSeason = dayjs("02/27/2023 11:00:00", "MM/DD/YYYY HH:mm:ss");

  // this how many resets we have in the season
  const numberOfDays = lastDayOfSeason.diff(startDate, "day");

  // this is the schedule we will build
  const schedule: { [key: string]: any } = {};

  let armorIndex = 0;
  let lostSectorIndex = 0;

  // loop through each day of the season
  for (let i = 0; i <= numberOfDays; i++) {
    const resetTimestamp = dayjs().startOf("day").add(11, "hour").unix() + 86400 * i;

    // ends 1 day after reset
    const endTimestamp = resetTimestamp + 86400;

    // we only have 4 armor types so  we need to loop through them repeatedly
    const rewardName = armorOrder[armorIndex];
    const lostSector = lostSectorOrderJson[lostSectorIndex];

    if (armorIndex === 3) {
      armorIndex = 0;
    } else {
      armorIndex++;
    }

    if (lostSectorIndex === 10) {
      lostSectorIndex = 0;
    } else {
      lostSectorIndex++;
    }

    schedule[resetTimestamp] = {
      ...lostSector,
      startsAt: resetTimestamp,
      endsAt: endTimestamp,
      rewardName,
    };
  }

  fs.writeFileSync(process.cwd() + "/json/lostSectorSchedule.json", JSON.stringify(schedule));

  res.status(200).send("ok");
}
