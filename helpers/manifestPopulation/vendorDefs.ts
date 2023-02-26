import prisma from "@/lib/prisma";
import { Vendor } from "@prisma/client";

const populateVendorDefs = async (url: string) => {
  try {
    const response = await fetch("https://www.bungie.net" + url);

    const json = await response.json();

    // delete all the old records
    await prisma.vendor.deleteMany({});

    // make json into an array of objects
    const vendorsArray = Object.keys(json).map((key) => {
      const numberHash = parseInt(key);

      const definition = json[key];

      const data: Vendor = {
        hash: numberHash,
        name: definition.displayProperties.name,
        description: definition.displayProperties.description,
        icon: definition.displayProperties.icon,
        hasIcon: definition.displayProperties.hasIcon,
        largeIcon: definition.displayProperties.largeIcon,
        mapIcon: definition.displayProperties.mapIcon,
        specialImage: definition.locations?.[0]?.backgroundImagePath,
        redacted: definition.redacted,
        blacklisted: definition.blacklisted,
      };

      return data;
    });

    await prisma.vendor.createMany({
      data: vendorsArray,
    });

    console.log("Vendor defs populated");
  } catch (error) {
    console.error(error);
  }
};

export default populateVendorDefs;
