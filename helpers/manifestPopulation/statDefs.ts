import prisma from "@/lib/prisma";
import { Stat } from "@prisma/client";
import axios from "axios";

const populateStatDefs = async (url: string) => {
  try {
    const response = await axios.get("https://www.bungie.net" + url);

    const { data: json } = response;

    await prisma.stat.deleteMany({});

    // make json into an array of objects
    const jsonArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const data: Stat = {
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

    await prisma.stat.createMany({
      data: jsonArray,
    });

    console.log("Stat defs populated");
  } catch (error) {
    console.error(error);
  }
};

export default populateStatDefs;
