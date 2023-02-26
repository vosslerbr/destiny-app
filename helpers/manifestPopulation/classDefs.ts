import prisma from "@/lib/prisma";
import { Class } from "@prisma/client";

const populateClassDefs = async (url: string) => {
  try {
    const response = await fetch("https://www.bungie.net" + url);

    const json = await response.json();

    await prisma.class.deleteMany({});

    // make json into an array of objects
    const jsonArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const classDef = json[key];

      const data: Class = {
        hash: numberHash,
        redacted: classDef.redacted,
        classType: classDef.classType,
        blacklisted: classDef.blacklisted,
        description: classDef?.displayProperties?.description || "",
        name: classDef?.displayProperties?.name || "",
        icon: classDef?.displayProperties?.icon || "",
        hasIcon: classDef?.displayProperties?.hasIcon ?? false,
        highResIcon: classDef?.displayProperties?.highResIcon || "",
      };

      return data;
    });

    await prisma.class.createMany({
      data: jsonArray,
    });

    console.log("Class defs populated");
  } catch (error) {
    console.error(error);
  }
};

export default populateClassDefs;
