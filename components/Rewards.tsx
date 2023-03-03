import { Tooltip } from "@mui/material";
import { Collectible, InventoryItem } from "@prisma/client";
import Image from "next/image";

interface LSRewardsProps {
  rewards: (Collectible & {
    inventoryItem: InventoryItem;
  })[];
}

export default function Rewards({ rewards }: LSRewardsProps) {
  return (
    <div className="rewards-container section-metadata">
      <h4>Rewards</h4>
      <div>
        {rewards.map((reward) => {
          const { icon, name, hash } = reward.inventoryItem;

          return (
            <Tooltip title={name} key={`${hash}_tooltip`} arrow>
              <Image
                src={`https://www.bungie.net${icon}`}
                alt={name || "Reward"}
                width="48"
                height="48"
                key={`${name}_image`}
                className="image-rounded reward-image"
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
