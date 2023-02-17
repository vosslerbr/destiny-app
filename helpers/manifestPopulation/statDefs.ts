import prisma from "@/lib/prisma";
import { StatDefinition } from "@prisma/client";

const populateStatDefs = async (url: string) => {
  try {
    const response = await fetch("https://www.bungie.net" + url);

    const json = await response.json();

    await prisma.statDefinition.deleteMany({});

    // make json into an array of objects
    const jsonArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const data: StatDefinition = {
        hash: numberHash,
        redacted: definition.redacted,
        aggregationType: definition.aggregationType,
        hasComputedBlock: definition.hasComputedBlock,
        blacklisted: definition.blacklisted,
        description: definition.displayProperties.description,
        name: definition.displayProperties.name,
        icon: definition.displayProperties.icon,
        hasIcon: definition.displayProperties.hasIcon,
        highResIcon: definition.displayProperties.highResIcon,
        interpolate: definition.interpolate,
        statCategory: definition.statCategory,
      };

      return data;
    });

    await prisma.statDefinition.createMany({
      data: jsonArray,
    });
  } catch (error) {
    console.error(error);
  }
};

export default populateStatDefs;
