import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import fs from "fs";
import { LostSectorScheduleDay } from "@/global";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  const nowTimestamp = dayjs().unix();

  // read the lost sector schedule json file
  const lostSectorSchedule = fs.readFileSync(
    process.cwd() + "/json/lostSectorSchedule.json",
    "utf8"
  );

  const lostSectorScheduleJson: { [key: string]: LostSectorScheduleDay } =
    JSON.parse(lostSectorSchedule);

  // we need the lost sector where the nowTimestamp is between the startsAt and endsAt
  const todaysLostSector = Object.values(lostSectorScheduleJson).find(
    (lostSector) => lostSector.startsAt <= nowTimestamp && lostSector.endsAt >= nowTimestamp
  );

  if (!todaysLostSector) {
    res.status(500).send("Lost sector data not found");

    return;
  }

  // get the hash and reward name
  const lostSectorHash = todaysLostSector.hash;
  const lostSectorRewardName = todaysLostSector.rewardName;

  // if we don't have a hash or reward name then we can't do anything
  if (!lostSectorHash || !lostSectorRewardName) {
    res.status(500).send("Lost sector data not found");

    return;
  }

  const lostSectorSourceHash = 2203185162;

  // Collectibles allow us to get what drops from the LS, and they relate to an InventoryItems
  const lostSectorCollectibles = await prisma.collectible.findMany({
    where: {
      sourceHash: lostSectorSourceHash,
      inventoryItem: {
        is: {
          itemTypeAndTierDisplayName: lostSectorRewardName,
        },
      },
    },
    include: {
      inventoryItem: true,
    },
  });

  // find the lost sector activity definition data
  const lostSectorActivity = await prisma.activity.findUnique({
    where: {
      hash: lostSectorHash,
    },
    include: {
      modifiers: {
        include: {
          activityModifier: true,
        },
      },
    },
  });

  if (!lostSectorActivity) {
    res.status(500).send("Lost sector activity data not found");
    return;
  }

  const lostSectorData = {
    name: lostSectorActivity.name,
    keyArt: lostSectorActivity.pgcrImage,
    modifiers: lostSectorActivity.modifiers,
    rewards: lostSectorCollectibles,
  };

  // return the data
  res.status(200).json(lostSectorData);
}
