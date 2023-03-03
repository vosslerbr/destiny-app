import { Collectible, InventoryItem } from "@prisma/client";
import Image from "next/image";
import classTypeMap from "@/helpers/classTypeMap";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "./Store";
import { LinearProgress, Tooltip } from "@mui/material";
import axios from "axios";

interface LSRewardsProps {
  rewards: (Collectible & {
    inventoryItem: InventoryItem;
  })[];
}

export default function RewardsDetail({ rewards }: LSRewardsProps) {
  const { user } = useContext(UserContext) as UserContextType;

  const [userInventory, setUserInventory] = useState<any[]>([]);
  const [userCollectibleStates, setUserCollectibleStates] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user.primaryMembershipId) {
      setIsLoading(false);

      return;
    }

    const getUserInventories = async () => {
      const tokenData = localStorage.getItem("tokenData");

      if (tokenData) {
        const parsedTokenData = JSON.parse(tokenData);

        const membershipType = user.destinyMemberships.find(
          (membership) => membership.membershipId === user.primaryMembershipId
        )?.membershipType;

        const response = await axios.post("/api/profile-inventories", {
          membershipType,
          membershipId: user.primaryMembershipId,
          access_token: parsedTokenData.access_token,
        });

        const { data } = response;

        setUserInventory(data.combinedInventory);
        setUserCollectibleStates(data.collectibleStates);
      }

      setIsLoading(false);
    };

    getUserInventories();
  }, [user]);

  return (
    <div className="items-grid">
      <h2>Rewards</h2>
      <div className="items-grid-inner">
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
            <div key={`${hash}_reward_card`} className="item-card">
              <div className="item-card-header">
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

              <div className="item-card-body">
                <Image
                  src={`https://www.bungie.net${screenshot}`}
                  blurDataURL={`https://www.bungie.net${screenshot}`}
                  alt={name || "screenshot"}
                  fill={true}
                  sizes="(max-width: 890px) 100vw, 600px"
                  key={`${name}_image`}
                  className="image-rounded reward-image"
                />
              </div>

              {isLoading ? (
                <LinearProgress
                  sx={{
                    marginTop: "1rem",
                  }}
                />
              ) : user?.primaryMembershipId ? (
                <div className="item-unlock-detail">
                  {isAcquired ? (
                    <Tooltip title="You've found this item before" arrow>
                      <span className="unlocked">Collections</span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="You haven't found this item yet" arrow>
                      <span className="locked">Collections</span>
                    </Tooltip>
                  )}

                  {userOwned?.length > 0 ? (
                    <Tooltip
                      title={`You have ${userOwned.length} of these in your inventory`}
                      arrow>
                      <span className="unlocked">Inventory</span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="You don't own this item" arrow>
                      <span className="locked">Inventory</span>
                    </Tooltip>
                  )}
                </div>
              ) : (
                <div className="item-unlock-prompt">
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
