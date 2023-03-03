import prisma from "@/lib/prisma";
import { Activity } from "@prisma/client";
import axios from "axios";

const populateActivityDefs = async (url: string) => {
  try {
    const response = await axios.get("https://www.bungie.net" + url);

    const { data: json } = response;

    // delete all the old records
    await prisma.activity.deleteMany({});

    // make json into an array of objects
    const activitiesArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const data: Activity = {
        hash: numberHash,
        name: definition.originalDisplayProperties.name,
        detailedName: definition.displayProperties.name,
        description: definition.displayProperties.description,
        lightLevel: definition.activityLightLevel,
        pgcrImage: definition.pgcrImage,
        directActivityModeType: definition.directActivityModeType,
      };

      return data;
    });

    await prisma.activity.createMany({
      data: activitiesArray,
    });

    console.log("Activity defs populated");
  } catch (error) {
    console.error(error);
  }
};

export default populateActivityDefs;
