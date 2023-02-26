import populateActivityDefs from "@/helpers/manifestPopulation/activityDefs";
import populateActivityModifierDefs from "@/helpers/manifestPopulation/activityModifierDefs";
import populateActivityModifierJoins from "@/helpers/manifestPopulation/activityModifierJoins";
import populateClassDefs from "@/helpers/manifestPopulation/classDefs";
import populateCollectibleDefs from "@/helpers/manifestPopulation/collectibleDefs";
import populateInventoryItemDefs from "@/helpers/manifestPopulation/inventoryItemDefs";
import populateStatDefs from "@/helpers/manifestPopulation/statDefs";
import populateVendorDefs from "@/helpers/manifestPopulation/vendorDefs";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  const manifestRes = await fetch(process.env.BUNGIE_MANIFEST_BASE_URL!);

  const manifestResJson = await manifestRes.json();

  // TODO uncomment for production
  const version: string = manifestResJson.Response.version;

  // check if the manifest record in the db is the same as the one we just fetched
  const manifestRecord = await prisma.manifest.findFirst({
    where: {
      version,
    },
  });

  if (manifestRecord) {
    console.log("Manifest is up to date");

    res.status(200).json({ message: "Manifest is up to date", success: true });

    return;
  }

  // if not, delete the old one and create a new one
  await prisma.manifest.deleteMany({});
  await prisma.manifest.create({
    data: {
      version,
    },
  });

  res.status(200).json({ message: "Manifest is being updated", success: true });

  const {
    DestinyClassDefinition,
    DestinyStatDefinition,
    DestinyActivityModifierDefinition,
    DestinyActivityDefinition,
    DestinyInventoryItemDefinition,
    DestinyCollectibleDefinition,
    DestinyVendorDefinition,
  }: {
    DestinyClassDefinition: string;
    DestinyStatDefinition: string;
    DestinyActivityModifierDefinition: string;
    DestinyActivityDefinition: string;
    DestinyInventoryItemDefinition: string;
    DestinyCollectibleDefinition: string;
    DestinyVendorDefinition: string;
  } = manifestResJson.Response.jsonWorldComponentContentPaths.en;

  await populateClassDefs(DestinyClassDefinition);
  await populateStatDefs(DestinyStatDefinition);
  await populateActivityModifierDefs(DestinyActivityModifierDefinition);
  await populateActivityDefs(DestinyActivityDefinition);
  await populateActivityModifierJoins(DestinyActivityDefinition);
  await populateInventoryItemDefs(DestinyInventoryItemDefinition);
  await populateCollectibleDefs(DestinyCollectibleDefinition);
  await populateVendorDefs(DestinyVendorDefinition);

  console.log("Manifest updated");
}
