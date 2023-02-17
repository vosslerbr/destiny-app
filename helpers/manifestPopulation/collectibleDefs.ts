import prisma from "@/lib/prisma";
import { Collectible } from "@prisma/client";

const populateCollectibleDefs = async (url: string) => {
  try {
    const response = await fetch("https://www.bungie.net" + url);

    const json = await response.json();

    // delete all the old records
    await prisma.collectible.deleteMany({});

    // make json into an array of objects
    const collectiblesArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const data: Collectible = {
        hash: numberHash,
        sourceHash: definition.sourceHash,
        inventoryItemHash: definition.itemHash,
      };

      return data;
    });

    await prisma.collectible.createMany({
      data: collectiblesArray,
    });
  } catch (error) {
    console.error(error);
  }
};

export default populateCollectibleDefs;
