import prisma from "@/lib/prisma";
import { Activity } from "@prisma/client";

const populateActivityDefs = async (url: string) => {
  try {
    const response = await fetch("https://www.bungie.net" + url);

    const json = await response.json();

    // delete all the old records
    await prisma.activity.deleteMany({});

    // make json into an array of objects
    const activitiesArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const data: Activity = {
        hash: numberHash,
        name: definition.originalDisplayProperties.name,
        pgcrImage: definition.pgcrImage,
        directActivityModeType: definition.directActivityModeType,
      };

      return data;
    });

    await prisma.activity.createMany({
      data: activitiesArray,
    });
  } catch (error) {
    console.error(error);
  }
};

export default populateActivityDefs;
