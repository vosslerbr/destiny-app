import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import fs from "fs";

interface LostSectorScheduleDay {
  name: string;
  hash: number;
  startsAt: number;
  endsAt: number;
  rewardName: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  const nowTimestamp = dayjs().unix();

  const lostSectorSchedule = fs.readFileSync(
    process.cwd() + "/json/lostSectorSchedule.json",
    "utf8"
  );

  const lostSectorScheduleJson: { [key: string]: LostSectorScheduleDay } =
    JSON.parse(lostSectorSchedule);

  // we need the lost sector where the nowTimestamp is between the startsAt and endsAt
  const todaysLostSector = Object.values(lostSectorScheduleJson).find(
    (lostSector: any) => lostSector.startsAt <= nowTimestamp && lostSector.endsAt >= nowTimestamp
  );

  // get the hash and reward name
  const lostSectorHash = todaysLostSector?.hash;
  const lostSectorRewardName = todaysLostSector?.rewardName;

  console.log("lostSectorHash", lostSectorHash);
  console.log("lostSectorRewardName", lostSectorRewardName);

  // if we don't have a hash or reward name then we can't do anything
  if (!lostSectorHash || !lostSectorRewardName) {
    res.status(404).send("Not found");

    return;
  }

  // find the lost sector activity definition data by hash
  const lostSectorActivityData = fs.readFileSync(process.cwd() + "/json/lostSectors.json", "utf8");

  const lostSectorActivityDataJson = JSON.parse(lostSectorActivityData);

  const lostSectorActivity = lostSectorActivityDataJson[lostSectorHash];

  // get the rewards for the lost sector
  const lostSectorRewards = fs.readFileSync(process.cwd() + "/json/lostSectorRewards.json", "utf8");

  const lostSectorRewardsJson: { [key: string]: any[] } = JSON.parse(lostSectorRewards);

  const rewards = lostSectorRewardsJson[lostSectorRewardName];

  // get the modifiers for the lost sector
  const modifiers: { activityModifierHash: number }[] = lostSectorActivity.modifiers;

  const actvityModifiers = fs.readFileSync(
    process.cwd() + "/json/DestinyActivityModifierDefinition.json",
    "utf8"
  );

  const actvityModifiersJson: { [key: string]: any } = JSON.parse(actvityModifiers);

  const modifierData = modifiers.map((modifier) => {
    const modifierHash = modifier.activityModifierHash;

    return actvityModifiersJson[modifierHash];
  });

  // return the data
  res
    .status(200)
    .json({ lostSector: { metadata: lostSectorActivity, rewards, modifiers: modifierData } });
}
