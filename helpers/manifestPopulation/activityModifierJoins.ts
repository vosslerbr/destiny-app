/**
 * @description populates the activityModifiersOnActivity table. If a modifier is not in the activityModifier table, it will not be added to the join table.
 */

import prisma from "@/lib/prisma";
import { ActivityModifiersOnActivity } from "@prisma/client";

const populateActivityModifierJoins = async (url: string) => {
  try {
    const response = await fetch("https://www.bungie.net" + url);

    const json = await response.json();

    // all the modifiers
    const validModifiers = await prisma.activityModifier.findMany();

    // we only care about the hashes
    const validModifiersHashes = validModifiers.map((modifier) => modifier.hash);

    // array to create join table records
    const activityModifierJoins = Object.keys(json).reduce((acc: any[], key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const dataArr = definition.modifiers?.reduce((acc: any[], modifier: any) => {
        if (!modifier || !validModifiersHashes.includes(modifier.activityModifierHash)) {
          return acc;
        }

        // @ts-ignore id not needed
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

    // delete all the old join table records
    await prisma.activityModifiersOnActivity.deleteMany({});

    // create the new join table records
    await prisma.activityModifiersOnActivity.createMany({
      data: activityModifierJoins.flat(),
    });
  } catch (error) {
    console.error(error);
  }
};

export default populateActivityModifierJoins;
