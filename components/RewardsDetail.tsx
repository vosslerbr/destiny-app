import { Collectible, InventoryItem } from "@prisma/client";
import Image from "next/image";
import classTypeMap from "@/helpers/classTypeMap";
import { useContext } from "react";
import { UserContext, UserContextType } from "./Store";
import { Tooltip } from "@mui/material";

interface LSRewardsProps {
  rewards: (Collectible & {
    inventoryItem: InventoryItem;
  })[];
  userInventory: any[];
  userCollectibleStates: { [key: string]: { state: number } };
}

export default function RewardsDetail({
  rewards,
  userInventory,
  userCollectibleStates,
}: LSRewardsProps) {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    <div className="activity-rewards-detail">
      <h2>Rewards</h2>
      <div className="activity-rewards-detail-inner">
        {rewards.map((reward) => {
          const { hash: collectibleHash } = reward;
          const { icon, name, hash, classType, itemTypeDisplayName, screenshot } =
            reward.inventoryItem;

          const userOwned = userInventory?.filter((item) => item.itemHash === hash);

          const collectibleState = userCollectibleStates[collectibleHash];

          // if collectibleState is odd, it's not been acquired
          const isAcquired = collectibleState?.state % 2 === 0;

          const className = typeof classType === "number" ? classTypeMap[classType] : "";

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

              {user?.primaryMembershipId ? (
                <div className="reward-unlock-detail">
                  {isAcquired ? (
                    <Tooltip title="You've found this item before" arrow>
                      <span className="yes">Collections</span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="You haven't found this item yet" arrow>
                      <span className="no">Collections</span>
                    </Tooltip>
                  )}

                  {userOwned?.length > 0 ? (
                    <Tooltip
                      title={`You have ${userOwned.length} of these in your inventory`}
                      arrow>
                      <span className="yes">Inventory</span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="You don't own this item" arrow>
                      <span className="no">Inventory</span>
                    </Tooltip>
                  )}
                </div>
              ) : (
                <div className="reward-unlock-prompt">
                  <p>Log in to see if you own this item</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
