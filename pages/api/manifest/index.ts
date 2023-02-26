import startUpdate from "@/helpers/manifestPopulation/startUpdate";
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

  startUpdate(manifestResJson);

  res.status(200).json({ message: "Manifest is being updated", success: true });
}
