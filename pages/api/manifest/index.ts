import prisma from "@/lib/prisma";
import { ClassDefinition } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  const manifestRes = await fetch(process.env.BUNGIE_MANIFEST_BASE_URL!);

  const manifestResJson = await manifestRes.json();

  const version: string = manifestResJson.Response.version;

  // check if the manifest record in the db is the same as the one we just fetched
  const manifestRecord = await prisma.manifest.findFirst({
    where: {
      version,
    },
  });

  if (manifestRecord) {
    console.log("Manifest is up to date");

    res.status(200).json({ name: "John Doe" });

    return;
  }

  // if not, delete the old one and create a new one
  await prisma.manifest.deleteMany({});
  await prisma.manifest.create({
    data: {
      version,
    },
  });

  const tablesNeeded = [
    {
      name: "Activity",
      model: "activityDefinition",
    },
    {
      name: "ActivityModifier",
      model: "activityModifierDefinition",
    },
    {
      name: "Collectible",
      model: "collectibleDefinition",
    },
    // {
    //   name: "InventoryItem",
    //   model: "inventoryItemDefinition",
    // },
    {
      name: "Class",
      model: "classDefinition",
    },
    {
      name: "Vendor",
      model: "vendorDefinition",
    },
    {
      name: "Stat",
      model: "statDefinition",
    },
  ];

  const response = await fetch(
    "https://www.bungie.net" +
      manifestResJson.Response.jsonWorldComponentContentPaths.en.DestinyClassDefinition
  );

  const json = await response.json();

  // @ts-ignore
  await prisma.classDefinition.deleteMany({});

  // make json into an array of objects
  const jsonArray = Object.keys(json).map((key) => {
    const numberHash = parseInt(key);

    const classDef = json[key];

    const data: ClassDefinition = {
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

  await prisma.classDefinition.createMany({
    data: jsonArray,
  });

  res.status(200).json({ name: "John Doe" });
}
