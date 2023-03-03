interface ItemSubTypeMap {
  [key: number]: {
    singular: string;
    plural: string;
  };
}

const itemSubTypeMap: ItemSubTypeMap = {
  0: { singular: "None", plural: "None" },
  1: { singular: "Crucible", plural: "Crucible" },
  2: { singular: "Vanguard", plural: "Vanguard" },
  5: { singular: "Exotic", plural: "Exotics" },
  6: { singular: "Auto Rifle", plural: "Auto Rifles" },
  7: { singular: "Shotgun", plural: "Shotguns" },
  8: { singular: "Machine Gun", plural: "Machine Guns" },
  9: { singular: "Hand Cannon", plural: "Hand Cannons" },
  10: { singular: "Rocket Launcher", plural: "Rocket Launchers" },
  11: { singular: "Fusion Rifle", plural: "Fusion Rifles" },
  12: { singular: "Sniper Rifle", plural: "Sniper Rifles" },
  13: { singular: "Pulse Rifle", plural: "Pulse Rifles" },
  14: { singular: "Scout Rifle", plural: "Scout Rifles" },
  16: { singular: "Crm", plural: "Crms" },
  17: { singular: "Sidearm", plural: "Sidearms" },
  18: { singular: "Sword", plural: "Swords" },
  19: { singular: "Mask", plural: "Masks" },
  20: { singular: "Shader", plural: "Shaders" },
  21: { singular: "Ornament", plural: "Ornaments" },
  22: { singular: "Fusion Rifle Line", plural: "Fusion Rifle Lines" },
  23: { singular: "Grenade Launcher", plural: "Grenade Launchers" },
  24: { singular: "Submachine Gun", plural: "Submachine Guns" },
  25: { singular: "Trace Rifle", plural: "Trace Rifles" },
  26: { singular: "Helmet Armor", plural: "Helmet Armors" },
  27: { singular: "Gauntlets Armor", plural: "Gauntlets Armors" },
  28: { singular: "Chest Armor", plural: "Chest Armors" },
  29: { singular: "Leg Armor", plural: "Leg Armors" },
  30: { singular: "Class Armor", plural: "Class Armors" },
  31: { singular: "Bow", plural: "Bows" },
  32: { singular: "Dummy Repeatable Bounty", plural: "Dummy Repeatable Bounties" },
  33: { singular: "Glaive", plural: "Glaives" },
};

export default itemSubTypeMap;
