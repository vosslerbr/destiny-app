import { ActivityModifier, Collectible } from "@prisma/client";

export interface ClassTypeMap {
  [key: number]: string;
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
