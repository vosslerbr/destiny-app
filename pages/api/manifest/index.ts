import populateActivityDefs from "@/helpers/manifestPopulation/activityDefs";
import populateActivityModifierDefs from "@/helpers/manifestPopulation/activityModifierDefs";
import populateClassDefs from "@/helpers/manifestPopulation/classDefs";
import populateStatDefs from "@/helpers/manifestPopulation/statDefs";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");

    return;
  }

  const manifestRes = await fetch(process.env.BUNGIE_MANIFEST_BASE_URL!);

  const manifestResJson = await manifestRes.json();

  // TODO uncomment for production
  // const version: string = manifestResJson.Response.version;

  // // check if the manifest record in the db is the same as the one we just fetched
  // const manifestRecord = await prisma.manifest.findFirst({
  //   where: {
  //     version,
  //   },
  // });

  // if (manifestRecord) {
  //   console.log("Manifest is up to date");

  //   res.status(200).json({ name: "John Doe" });

  //   return;
  // }

  // if not, delete the old one and create a new one
  // await prisma.manifest.deleteMany({});
  // await prisma.manifest.create({
  //   data: {
  //     version,
  //   },
  // });

  const tablesNeeded = [
    {
      name: "Activity",
      model: "activityDefinition",
    },
    // {
    //   name: "ActivityModifier",
    //   model: "activityModifierDefinition",
    // },
    {
      name: "Collectible",
      model: "collectibleDefinition",
    },
    {
      name: "InventoryItem",
      model: "inventoryItemDefinition",
    },
    // {
    //   name: "Class",
    //   model: "classDefinition",
    // },
    {
      name: "Vendor",
      model: "vendorDefinition",
    },
    // {
    //   name: "Stat",
    //   model: "statDefinition",
    // },
  ];

  const {
    DestinyClassDefinition,
    DestinyStatDefinition,
    DestinyActivityModifierDefinition,
    DestinyActivityDefinition,
  }: {
    DestinyClassDefinition: string;
    DestinyStatDefinition: string;
    DestinyActivityModifierDefinition: string;
    DestinyActivityDefinition: string;
  } = manifestResJson.Response.jsonWorldComponentContentPaths.en;

  await populateClassDefs(DestinyClassDefinition);
  await populateStatDefs(DestinyStatDefinition);
  await populateActivityModifierDefs(DestinyActivityModifierDefinition);
  await populateActivityDefs(DestinyActivityDefinition);

  res.status(200).json({ name: "John Doe" });
}
