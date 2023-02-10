import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

// This is how we keep some of the data we need up to date
// TODO eventually we should setup a cron to do this for us
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  // fetch the latest manifest info
  const activityDefinitionManifest = await fetch(process.env.BUNGIE_MANIFEST_BASE_URL!, {
    method: "GET",
    headers: {
      "X-API-Key": process.env.BUNGIE_API_KEY!,
    },
  });

  const activityDefinitionManifestJson = await activityDefinitionManifest.json();

  const componentContentPaths =
    activityDefinitionManifestJson.Response.jsonWorldComponentContentPaths.en;

  const collectiblesDefinitions = await fetch(
    `${process.env.BUNGIE_API_URL!}${componentContentPaths["DestinyCollectibleDefinition"]}`,
    {
      method: "GET",
      headers: {
        "X-API-Key": process.env.BUNGIE_API_KEY!,
      },
    }
  );

  const collectiblesDefinitionsJson = await collectiblesDefinitions.json();

  const lostSectorSourceHash = 2203185162;

  // remove anything that doesn't drop from a lost sector
  for (const key in collectiblesDefinitionsJson) {
    const sourceHash = collectiblesDefinitionsJson[key].sourceHash;

    if (sourceHash !== lostSectorSourceHash) {
      delete collectiblesDefinitionsJson[key];
    }
  }

  // need a list of collectible hashes to filter out, must change to a number
  const collectibleHashes = Object.keys(collectiblesDefinitionsJson).map((key) => {
    return collectiblesDefinitionsJson[key].hash;
  });

  // these are the chunks of data we need to keep up to date
  const pathsToWriteToDisk = [
    "DestinyActivityDefinition",
    "DestinyActivityModifierDefinition",
    "DestinyInventoryItemDefinition", // TODO this leaves out info we need, remove the lite
  ];

  for (const path of pathsToWriteToDisk) {
    const url = `${process.env.BUNGIE_API_URL!}${componentContentPaths[path]}`;

    console.log(`Fetching ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": process.env.BUNGIE_API_KEY!,
      },
    });

    const json = await response.json();

    // filter anything that's not a lost sector (later we'll need Nightfalls)
    if (path === "DestinyActivityDefinition") {
      const lostSectorActivityMode = 87;

      for (const key in json) {
        if (json[key].directActivityModeType !== lostSectorActivityMode) {
          delete json[key];
        }
      }

      const pathToJson = process.cwd() + "/json/lostSectors.json";

      fs.writeFileSync(pathToJson, JSON.stringify(json));

      continue;
    }

    if (path === "DestinyInventoryItemDefinition") {
      const armorTypes = [
        "Exotic Leg Armor",
        "Exotic Gauntlets",
        "Exotic Chest Armor",
        "Exotic Helmet",
      ];

      const groupedRewards: { helmet: any[]; gauntlet: any[]; chest: any[]; leg: any[] } = {
        helmet: [],
        gauntlet: [],
        chest: [],
        leg: [],
      };

      // remove anything that's not armor or a lost sector collectible
      for (const key in json) {
        const item = json[key];

        const itemTypeAndTierDisplayName = item.itemTypeAndTierDisplayName;

        const isCorrectArmorType = armorTypes.includes(itemTypeAndTierDisplayName);
        const isLSCollectible = collectibleHashes.includes(item.collectibleHash);

        if (!isCorrectArmorType || !isLSCollectible) {
          delete json[key];
          continue;
        }

        // group the rewards by armor type
        if (itemTypeAndTierDisplayName === "Exotic Helmet") {
          groupedRewards.helmet.push(item);
        }

        if (itemTypeAndTierDisplayName === "Exotic Gauntlets") {
          groupedRewards.gauntlet.push(item);
        }

        if (itemTypeAndTierDisplayName === "Exotic Chest Armor") {
          groupedRewards.chest.push(item);
        }

        if (itemTypeAndTierDisplayName === "Exotic Leg Armor") {
          groupedRewards.leg.push(item);
        }
      }

      const pathToJson = process.cwd() + "/json/lostSectorRewards.json";

      fs.writeFileSync(pathToJson, JSON.stringify(groupedRewards));

      continue;
    }

    // fallback for all other paths
    const pathToJson = process.cwd() + `/json/${path}.json`;

    fs.writeFileSync(pathToJson, JSON.stringify(json));
  }

  res.status(200).json({ version: activityDefinitionManifestJson.Response.version });
}
