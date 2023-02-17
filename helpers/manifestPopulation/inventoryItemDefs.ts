import prisma from "@/lib/prisma";
import { InventoryItem } from "@prisma/client";
import _ from "lodash";

const populateInventoryItemDefs = async (url: string) => {
  try {
    const response = await fetch("https://www.bungie.net" + url);

    const json = await response.json();

    // delete all the old records
    await prisma.collectible.deleteMany({});
    await prisma.inventoryItem.deleteMany({});

    // make json into an array of objects
    const itemsArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const data: InventoryItem = {
        hash: numberHash,
        name: definition.displayProperties.name,
        icon: definition.displayProperties.icon,
        hasIcon: definition.displayProperties.hasIcon,
        description: definition.displayProperties.description,
        highResIcon: definition.displayProperties.highResIcon,
        collectibleHash: definition.collectibleHash,
        screenshot: definition.screenshot,
        itemTypeDisplayName: definition.itemTypeDisplayName,
        flavorText: definition.flavorText,
        uiItemDisplayStyle: definition.uiItemDisplayStyle,
        itemTypeAndTierDisplayName: definition.itemTypeAndTierDisplayName,
        displaySource: definition.displaySource,
        specialItemType: definition.specialItemType,
        itemType: definition.itemType,
        itemSubType: definition.itemSubType,
        classType: definition.classType,
        breakerType: definition.breakerType,
        equippable: definition.equippable,
        defaultDamageType: definition.defaultDamageType,
        isWrapper: definition.isWrapper,
        index: definition.index,
        redacted: definition.redacted,
        blacklisted: definition.blacklisted,
      };

      return data;
    });

    // chunk the array into smaller arrays of 2000
    const chunks = _.chunk(itemsArray, 2000);

    for (const chunk of chunks) {
      console.log("chunk", chunk.length);

      await prisma.inventoryItem.createMany({
        data: chunk,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export default populateInventoryItemDefs;
