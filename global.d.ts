import {
  Activity,
  ActivityModifier,
  ActivityModifiersOnActivity,
  Collectible,
  InventoryItem,
  LostSectorDay,
} from "@prisma/client";

export interface ClassTypeMap {
  [key: number]: string;
}

export interface LostSectorData extends LostSectorDay {
  activity: {
    modifiers: Array<ActivityModifiersOnActivity & { activityModifier: ActivityModifier }>;
  } & Activity;
  rewards: Array<Collectible & { inventoryItem: InventoryItem }>;
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
