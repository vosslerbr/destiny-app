import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import dayjs from "dayjs";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

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

  const armorCollectibles: {
    [key: string]: { hash: number }[];
  } = {
    "Exotic Helmet": [],
    "Exotic Leg Armor": [],
    "Exotic Gauntlets": [],
    "Exotic Chest Armor": [],
  };

  const lostSectorSourceHash = 2203185162;

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

  const lostSectorOrder = fs.readFileSync(process.cwd() + "/json/LostSectorOrder.json", "utf8");

  const lostSectorOrderJson = JSON.parse(lostSectorOrder);

  const startDate = dayjs().startOf("day").add(11, "hour");
  const lastDayOfSeason = dayjs("02/27/2023 11:00:00", "MM/DD/YYYY HH:mm:ss");

  // this how many resets we have in the season
  const numberOfDays = lastDayOfSeason.diff(startDate, "day");

  // this is the schedule we will build
  const lostSectorDays: Prisma.LostSectorDayCreateInput[] = [];

  let armorIndex = 2;
  let lostSectorIndex = 0;

  // loop through each day of the season
  for (let i = 0; i <= numberOfDays; i++) {
    const resetTimestamp = dayjs().startOf("day").add(11, "hour").unix() + 86400 * i;

    // need resetTimestamp as a date
    const reset = dayjs.unix(resetTimestamp).toISOString();

    // ends at next reset
    const nextReset = dayjs.unix(resetTimestamp + 86400).toISOString();

    // we only have 4 armor types so  we need to loop through them repeatedly
    const rewardName = armorOrder[armorIndex];
    const lostSector: { name: string; hash: number } = lostSectorOrderJson[lostSectorIndex];

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

  for (const lostSectorDay of lostSectorDays) {
    await prisma.lostSectorDay.create({
      data: lostSectorDay,
    });
  }

  res.status(200).json({ message: "created lost sector days", success: true });
}
