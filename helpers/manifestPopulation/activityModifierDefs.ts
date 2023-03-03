import prisma from "@/lib/prisma";
import { ActivityModifier } from "@prisma/client";
import axios from "axios";

const populateActivityModifierDefs = async (url: string) => {
  try {
    const response = await axios.get("https://www.bungie.net" + url);

    const { data: json } = response;

    await prisma.activityModifier.deleteMany({});

    // make json into an array of objects
    const jsonArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const data: ActivityModifier = {
        hash: numberHash,
        redacted: definition.redacted,
        displayInNavMode: definition.displayInNavMode,
        displayInActivitySelection: definition.displayInActivitySelection,
        blacklisted: definition.blacklisted,
        description: definition.displayProperties.description,
        name: definition.displayProperties.name,
        icon: definition.displayProperties.icon,
        hasIcon: definition.displayProperties.hasIcon,
        highResIcon: definition.displayProperties.highResIcon,
      };

      return data;
    });

    await prisma.activityModifier.createMany({
      data: jsonArray,
    });

    console.log("Activity modifier defs populated");
  } catch (error) {
    console.error(error);
  }
};

export default populateActivityModifierDefs;
