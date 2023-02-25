import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import fs from "fs";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  const nowTimestamp = dayjs().unix();

  // read the lost sector schedule json file
  const nightfallSchedule = fs.readFileSync(process.cwd() + "/json/nightfallSchedule.json", "utf8");

  // TODO types
  const nightfallScheduleJson: any = JSON.parse(nightfallSchedule);

  // we need the lost sector where the nowTimestamp is between the startsAt and endsAt
  const currentNightfall: any = Object.values(nightfallScheduleJson).find(
    (nightfall: any) => nightfall.startsAt <= nowTimestamp && nightfall.endsAt >= nowTimestamp
  );

  if (!currentNightfall) {
    res.status(500).send("Lost sector data not found");

    return;
  }

  const adeptNightfall = await prisma.activity.findUnique({
    where: {
      hash: currentNightfall.difficulties.adept,
    },
    include: {
      modifiers: {
        include: {
          activityModifier: true,
        },
      },
    },
  });

  const heroNightfall = await prisma.activity.findUnique({
    where: {
      hash: currentNightfall.difficulties.hero,
    },
    include: {
      modifiers: {
        include: {
          activityModifier: true,
        },
      },
    },
  });
  const legendNightfall = await prisma.activity.findUnique({
    where: {
      hash: currentNightfall.difficulties.legend,
    },
    include: {
      modifiers: {
        include: {
          activityModifier: true,
        },
      },
    },
  });
  const masterNightfall = await prisma.activity.findUnique({
    where: {
      hash: currentNightfall.difficulties.master,
    },
    include: {
      modifiers: {
        include: {
          activityModifier: true,
        },
      },
    },
  });
  const grandmasterNightfall = await prisma.activity.findUnique({
    where: {
      hash: currentNightfall.difficulties.grandmaster,
    },
    include: {
      modifiers: {
        include: {
          activityModifier: true,
        },
      },
    },
  });

  const nightfallActivities = [adeptNightfall, heroNightfall, legendNightfall, masterNightfall];

  const keyart = adeptNightfall?.pgcrImage;
  const name = adeptNightfall?.description;

  if (!nightfallActivities.length) {
    res.status(500).send("Lost sector activity data not found");
    return;
  }

  const data = {
    name,
    keyart,
    difficulties: nightfallActivities,
    grandmaster: grandmasterNightfall,
  };

  // return the data
  res.status(200).json(data);
}
