import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  const { id } = req.query;

  const lostSector = await prisma.lostSectorDay.findUnique({
    where: {
      id: Number(id),
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

  if (!lostSector) {
    res.status(500).json({ message: "Lost sector not found", success: false });

    return;
  }

  // return the data
  res.status(200).json(lostSector);
}
