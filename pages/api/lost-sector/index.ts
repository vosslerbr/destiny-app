import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import fs from "fs";
import classTypeMap from "@/helpers/classTypeMap";
import { LostSectorScheduleDay, RewardsData } from "@/global";
import {
  getActivityModifier,
  getAll,
  includeTables,
  load,
  setApiKey,
  setManifestsPath,
  verbose,
} from "@d2api/manifest-node";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  verbose(); // make the client chatty. if you want.
  setApiKey(process.env.BUNGIE_API_KEY!);
  includeTables(["ActivityModifier", "Activity", "Collectible", "InventoryItem"]);

  setManifestsPath(path.join(process.cwd(), "manifests"));

  await load();

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

  // get the hash and reward name
  const lostSectorHash = todaysLostSector?.hash;
  const lostSectorRewardName = todaysLostSector?.rewardName;

  // if we don't have a hash or reward name then we can't do anything
  if (!lostSectorHash || !lostSectorRewardName) {
    res.status(500).send("Lost sector data not found");

    return;
  }

  const lostSectorSourceHash = 2203185162;

  const armorTypes = [
    "Exotic Leg Armor",
    "Exotic Gauntlets",
    "Exotic Chest Armor",
    "Exotic Helmet",
  ];

  // Collectibles allow us to get what drops from the LS, and they reference an actual InventoryItem
  const collectibles = getAll("Collectible");

  // remove any collectibles that don't drop from a lost sector
  const lostSectorCollectibles = collectibles.filter((collectible) => {
    return collectible.sourceHash === lostSectorSourceHash;
  });

  // get all the hashes for the collectibles
  const collectibleHashes = lostSectorCollectibles.map((collectible) => {
    return collectible.hash;
  });

  const inventoryItems = getAll("InventoryItem");

  // filter the inventory items to only include the ones that are today's reward, are the correct armor type, and are an LS collectible
  const rewards: RewardsData[] = inventoryItems.reduce((acc: RewardsData[], item) => {
    const { itemTypeAndTierDisplayName, collectibleHash } = item;

    const isCorrectArmorType = armorTypes.includes(itemTypeAndTierDisplayName);

    const isLSCollectible = collectibleHash && collectibleHashes.includes(collectibleHash);

    const isTodaysReward = itemTypeAndTierDisplayName === lostSectorRewardName;

    if (isTodaysReward && isCorrectArmorType && isLSCollectible) {
      acc.push({
        name: item.displayProperties.name,
        icon: item.displayProperties.icon,
        screenshot: item.screenshot,
        itemType: item.itemTypeAndTierDisplayName,
        classType: classTypeMap[item.classType],
      });
    }

    return acc;
  }, []);

  // find the lost sector activity definition data by hash
  const activities = getAll("Activity");

  const lostSectorActivityMode = 87;

  const lostSectors = activities.filter((activity) => {
    return activity.directActivityModeType === lostSectorActivityMode;
  });

  const lostSectorActivity = lostSectors.find((lostSector) => {
    return lostSector.hash === lostSectorHash;
  });

  if (!lostSectorActivity) {
    res.status(500).send("Lost sector activity data not found");
    return;
  }

  // get the modifiers for the lost sector
  const modifiers: { activityModifierHash: number }[] = lostSectorActivity.modifiers;

  const modifierData = modifiers.map((modifier) => {
    const modifierHash = modifier.activityModifierHash;

    const modifierData = getActivityModifier(modifierHash);

    return {
      name: modifierData?.displayProperties?.name,
      description: modifierData?.displayProperties?.description,
      icon: modifierData?.displayProperties?.icon,
    };
  });

  const lostSectorData = {
    name: lostSectorActivity.originalDisplayProperties.name,
    keyArt: lostSectorActivity.pgcrImage,
    modifiers: modifierData,
    rewards,
  };

  // return the data
  res.status(200).json({ lostSector: lostSectorData });
}
