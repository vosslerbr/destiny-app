import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import dayjs from "dayjs";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  // delete all existing lost sector days
  await prisma.lostSectorDay.deleteMany({});

  const armorOrder = [
    "Exotic Chest Armor",
    "Exotic Helmet",
    "Exotic Leg Armor",
    "Exotic Gauntlets",
  ];

  const armorCollectibles: {
    [key: string]: { hash: number }[];
  } = {
    "Exotic Helmet": [],
    "Exotic Leg Armor": [],
    "Exotic Gauntlets": [],
    "Exotic Chest Armor": [],
  };

  const lostSectorSourceHash = 2203185162;

  // find any collectibles that drop from Lost Sectors and are of a specific armor type
  for (const armor of armorOrder) {
    const lostSectorCollectibles = await prisma.collectible.findMany({
      where: {
        sourceHash: lostSectorSourceHash,
        inventoryItem: {
          is: {
            itemTypeAndTierDisplayName: armor,
          },
        },
      },
    });

    armorCollectibles[armor] = lostSectorCollectibles.map((collectible) => {
      return { hash: collectible.hash };
    });
  }

  const lostSectorOrder = fs.readFileSync(process.cwd() + "/json/LostSectorOrderS20.json", "utf8");

  const lostSectorOrderJson = JSON.parse(lostSectorOrder);

  const startDate = dayjs("02/28/2023").startOf("day").add(11, "hour"); // The first day we want to start the schedule
  const lastDayOfSeason = dayjs("05/22/2023 11:00:00", "MM/DD/YYYY HH:mm:ss");

  // this how many resets we have in the season
  const numberOfDays = lastDayOfSeason.diff(startDate, "day");

  // this is the schedule we will build
  const lostSectorDays: Prisma.LostSectorDayCreateInput[] = [];

  let armorIndex = 0;
  let lostSectorIndex = 0;

  // loop through each day of the season
  for (let i = 0; i <= numberOfDays; i++) {
    const firstResetTimestamp =
      dayjs("02/28/2023").startOf("day").add(11, "hour").unix() + 86400 * i;

    // need resetTimestamp as a date
    const reset = dayjs.unix(firstResetTimestamp).toISOString();

    // ends at next reset
    const nextReset = dayjs.unix(firstResetTimestamp + 86400).toISOString();

    // we only have 4 armor types so  we need to loop through them repeatedly
    const rewardName = armorOrder[armorIndex];
    const lostSector: { name: string; hash: number } = lostSectorOrderJson[lostSectorIndex];

    // reset armor loop if needed
    if (armorIndex === armorOrder.length - 1) {
      armorIndex = 0;
    } else {
      armorIndex++;
    }

    // reset lost sector loop if needed
    if (lostSectorIndex === lostSectorOrderJson.length - 1) {
      lostSectorIndex = 0;
    } else {
      lostSectorIndex++;
    }

    const lostSectorDay: Prisma.LostSectorDayCreateInput = {
      startsAt: reset,
      endsAt: nextReset,
      name: lostSector.name,
      activity: {
        connect: {
          hash: lostSector.hash,
        },
      },
      rewards: {
        connect: armorCollectibles[rewardName],
      },
    };

    lostSectorDays.push(lostSectorDay);
  }

  // create each day one at a time
  for (const lostSectorDay of lostSectorDays) {
    await prisma.lostSectorDay.create({
      data: lostSectorDay,
    });
  }

  res.status(200).json({ message: "created lost sector days", success: true });
}
