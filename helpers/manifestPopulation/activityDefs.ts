import prisma from "@/lib/prisma";
import { Activity, ActivityModifiersOnActivity } from "@prisma/client";

const populateActivityDefs = async (url: string) => {
  try {
    const response = await fetch("https://www.bungie.net" + url);

    const json = await response.json();

    await prisma.activity.deleteMany({});

    // make json into an array of objects
    const jsonArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const data: Activity = {
        hash: numberHash,
        directActivityModeType: definition.directActivityModeType,
      };

      return data;
    });

    await prisma.activity.createMany({
      data: jsonArray,
    });

    // array to create join table records
    const array2 = Object.keys(json).reduce((acc: any[], key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const dataArr = definition?.modifiers?.reduce((acc: any[], modifier: any) => {
        if (!modifier) {
          return acc;
        }

        const data: ActivityModifiersOnActivity = {
          activityHash: numberHash,
          activityModifierHash: modifier.activityModifierHash,
        };

        acc.push(data);

        return acc;
      }, []);

      if (!dataArr) {
        return acc;
      }

      acc.push(dataArr);

      return acc;
    }, []);

    // flatten array
    const flattenedArray = array2.flat();

    flattenedArray.forEach((item) => {
      if (!item.activityHash) {
        console.log(item);
      }

      if (!item.activityModifierHash) {
        console.log(item);
      }
    });

    await prisma.activityModifiersOnActivity.deleteMany({});

    await prisma.activityModifiersOnActivity.createMany({
      data: flattenedArray,
    });
  } catch (error) {
    console.error(error);
  }
};

export default populateActivityDefs;
