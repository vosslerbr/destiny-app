import { Collectible, InventoryItem } from "@prisma/client";
import Image from "next/image";
import classTypeMap from "@/helpers/classTypeMap";

interface LSRewardsProps {
  rewards: (Collectible & {
    inventoryItem: InventoryItem;
  })[];
}

export default function RewardsDetail({ rewards }: LSRewardsProps) {
  return (
    <div className="activity-rewards-detail">
      <h2>Rewards</h2>
      <div className="activity-rewards-detail-inner">
        {rewards.map((reward, index) => {
          const { icon, name, hash, classType, itemTypeDisplayName, screenshot } =
            reward.inventoryItem;

          const className = typeof classType === "number" ? classTypeMap[classType] : "";

          const hasInInventory = index === 2 || index === 4;
          const hasInCollections = index === 1 || index === 2 || index === 3 || index === 4;

          return (
            <div key={`${hash}_reward_card`} className="reward-card">
              <div className="reward-card-header">
                <div>
                  <h3>{name}</h3>
                  <p>
                    {className} {itemTypeDisplayName}
                  </p>
                </div>

                <Image
                  src={`https://www.bungie.net${icon}`}
                  alt={name || "Reward"}
                  width="48"
                  height="48"
                  key={`${name}_image`}
                  className="image-rounded reward-image"
                />
              </div>

              <div className="reward-card-body">
                <Image
                  src={`https://www.bungie.net${screenshot}`}
                  alt={name || "screenshot"}
                  fill={true}
                  key={`${name}_image`}
                  className="image-rounded reward-image"
                />
              </div>

              <div className="reward-unlock-detail">
                <span className={hasInCollections ? "yes" : "no"}>Collections</span>
                <span className={hasInInventory ? "yes" : "no"}>Inventory</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
