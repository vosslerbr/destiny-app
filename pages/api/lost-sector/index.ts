import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  const nowTimestamp = dayjs.unix(dayjs().unix()).toISOString();

  const todaysLostSector = await prisma.lostSectorDay.findFirst({
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
      rewards: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  if (!todaysLostSector) {
    res.status(500).send("Lost sector data not found");

    return;
  }

  // return the data
  res.status(200).json(todaysLostSector);
}
