import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import dayjs from "dayjs";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  // delete all existing nightfall weeks
  await prisma.nightfallWeek.deleteMany({});

  const nightfallOrder = fs.readFileSync(process.cwd() + "/json/NightFallOrderS20.json", "utf8");

  const nightfallOrderJson = JSON.parse(nightfallOrder);

  const startDate = dayjs("02/28/2023").startOf("day").add(11, "hour"); // The first day we want to start the schedule

  const lastDayOfSeason = dayjs("05/22/2023 11:00:00", "MM/DD/YYYY HH:mm:ss");

  // this how many resets we have in the season
  const numberOfWeeks = lastDayOfSeason.diff(startDate, "week");

  const nightfallWeeks: Prisma.NightfallWeekCreateInput[] = [];

  // starting index for nightfall
  let nightfallIndex = 0;

  // loop through each day of the season
  for (let i = 0; i <= numberOfWeeks; i++) {
    const firstResetTimestamp =
      dayjs("02/28/2023").startOf("day").add(11, "hour").unix() + 604800 * i;

    // need resetTimestamp as a date
    const reset = dayjs.unix(firstResetTimestamp).toISOString();

    // ends at next weekly reset
    const nextReset = dayjs.unix(firstResetTimestamp + 604800).toISOString();

    const nightfall = nightfallOrderJson[nightfallIndex];

    if (nightfallIndex === nightfallOrderJson.length - 1) {
      nightfallIndex = 0;
    } else {
      nightfallIndex++;
    }

    const difficulties = Object.keys(nightfall.difficulties);

    // create a nightfall week for each difficulty
    difficulties.forEach((difficulty) => {
      const nightfallWeek: Prisma.NightfallWeekCreateInput = {
        startsAt: reset,
        endsAt: nextReset,
        name: nightfall.name,
        difficulty,
        activity: {
          connect: {
            hash: nightfall.difficulties[difficulty],
          },
        },
      };

      nightfallWeeks.push(nightfallWeek);
    });
  }

  // create all the nightfall weeks
  for (const nightfallWeek of nightfallWeeks) {
    await prisma.nightfallWeek.create({
      data: nightfallWeek,
    });
  }

  res.status(200).json({ message: "Nightfall schedule generated", success: true });
}
