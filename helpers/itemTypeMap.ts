interface ItemTypeMap {
  [key: number]: {
    singular: string;
    plural: string;
  };
}

const itemTypeMap: ItemTypeMap = {
  0: { singular: "None", plural: "None" },
  1: { singular: "Currency", plural: "Currencies" },
  2: { singular: "Armor", plural: "Armor" },
  3: { singular: "Weapon", plural: "Weapons" },
  7: { singular: "Message", plural: "Messages" },
  8: { singular: "Engram", plural: "Engrams" },
  9: { singular: "Consumable", plural: "Consumables" },
  10: { singular: "Exchange Material", plural: "Exchange Materials" },
  11: { singular: "Mission Reward", plural: "Mission Rewards" },
  12: { singular: "Quest Step", plural: "Quest Steps" },
  13: { singular: "Quest Step Complete", plural: "Quest Step Completes" },
  14: { singular: "Emblem", plural: "Emblems" },
  15: { singular: "Quest", plural: "Quests" },
  16: { singular: "Subclass", plural: "Subclasses" },
  17: { singular: "Clan Banner", plural: "Clan Banners" },
  18: { singular: "Aura", plural: "Auras" },
  19: { singular: "Mod", plural: "Mods" },
  20: { singular: "Dummy", plural: "Dummies" },
  21: { singular: "Ship", plural: "Ships" },
  22: { singular: "Vehicle", plural: "Vehicles" },
  23: { singular: "Emote", plural: "Emotes" },
  24: { singular: "Ghost", plural: "Ghosts" },
  25: { singular: "Package", plural: "Packages" },
  26: { singular: "Bounty", plural: "Bounties" },
  27: { singular: "Wrapper", plural: "Wrappers" },
  28: { singular: "Seasonal Artifact", plural: "Seasonal Artifacts" },
  29: { singular: "Finisher", plural: "Finishers" },
  30: { singular: "Pattern", plural: "Patterns" },
};

export default itemTypeMap;
