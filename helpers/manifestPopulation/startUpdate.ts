import populateActivityDefs from "./activityDefs";
import populateActivityModifierDefs from "./activityModifierDefs";
import populateActivityModifierJoins from "./activityModifierJoins";
import populateClassDefs from "./classDefs";
import populateCollectibleDefs from "./collectibleDefs";
import populateInventoryItemDefs from "./inventoryItemDefs";
import populateStatDefs from "./statDefs";
import populateVendorDefs from "./vendorDefs";

const startUpdate = async (manifestResJson: any) => {
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
};

export default startUpdate;
