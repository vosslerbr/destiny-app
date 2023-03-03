import prisma from "@/lib/prisma";
import { Collectible } from "@prisma/client";
import axios from "axios";

const populateCollectibleDefs = async (url: string) => {
  try {
    const response = await axios.get("https://www.bungie.net" + url);

    const { data: json } = response;

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

    console.log("Collectible defs populated");
  } catch (error) {
    console.error(error);
  }
};

export default populateCollectibleDefs;
