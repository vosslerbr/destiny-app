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

export interface RewardsData {
  name: string;
  icon: string;
  screenshot: string;
  itemType: string;
  classType: string;
}

export interface ModifiersData {
  name: string;
  icon: string;
  description: string;
}

export interface LostSectorData {
  name: string;
  keyArt: string;
  modifiers: ModifiersData[];
  rewards: RewardsData[];
}
