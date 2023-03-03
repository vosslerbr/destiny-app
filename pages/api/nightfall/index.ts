import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  const nowTimestamp = dayjs.unix(dayjs().unix()).toISOString();

  const nightfalls = await prisma.nightfallWeek.findMany({
    where: {
      startsAt: {
        lte: nowTimestamp,
      },
      endsAt: {
        gte: nowTimestamp,
      },
    },
    include: {
      activity: {
        include: {
          modifiers: {
            include: {
              activityModifier: true,
            },
          },
        },
      },
    },
  });

  if (!nightfalls.length) {
    res.status(500).json({ message: "Nightfall data not found", success: false });

    return;
  }

  const heroNightfall = nightfalls.find((nightfall) => nightfall.difficulty === "hero");

  const legendNightfall = nightfalls.find((nightfall) => nightfall.difficulty === "legend");

  const masterNightfall = nightfalls.find((nightfall) => nightfall.difficulty === "master");

  const grandmasterNightfall = nightfalls.find(
    (nightfall) => nightfall.difficulty === "grandmaster"
  );

  const keyart = heroNightfall?.activity?.pgcrImage;
  const name = heroNightfall?.activity?.description; // idk why but this is the name

  const data = {
    name,
    keyart,
    difficulties: [heroNightfall, legendNightfall, masterNightfall],
    grandmaster: grandmasterNightfall,
  };

  // return the data
  res.status(200).json(data);
}
