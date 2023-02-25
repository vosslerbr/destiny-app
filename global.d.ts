import { ActivityModifier, Collectible } from "@prisma/client";

export interface ClassTypeMap {
  [key: number]: string;
}

export interface ItemTypeMap {
  [key: number]: {
    singular: string;
    plural: string;
  };
}
export interface LostSectorScheduleDay {
  name: string;
  hash: number;
  startsAt: number;
  endsAt: number;
  rewardName: string;
}

export interface LostSectorData {
  name: string;
  keyArt: string;
  modifiers: (ActivityModifiersOnActivity & { activityModifier: ActivityModifier })[];
  rewards: (Collectible & { inventoryItem: InventoryItem })[];
}

export interface NightfallData {
  name: string | null;
  keyart: string | null;
  difficulties: (Activity & {
    modifiers: (ActivityModifiersOnActivity & {
      activityModifier: ActivityModifier;
    })[];
  })[];
  grandmaster: Activity & {
    modifiers: (ActivityModifiersOnActivity & {
      activityModifier: ActivityModifier;
    })[];
  };
}
