import Image from "next/image";
import classTypeMap from "@/helpers/classTypeMap";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "./Store";
import { LinearProgress, Tooltip } from "@mui/material";
import axios from "axios";

interface Props {
  items: {
    hash: number;
    collectibleHash: number | null;
    name: string;
    description: string;
    icon: string;
    screenshot: string;
    itemTypeAndTier: string;
    itemType: string;
    itemTier: string;
    classType: number | null;
    stats: any;
  }[];
}

export default function XurQuestExoticsDetail({ items }: Props) {
  const { user } = useContext(UserContext) as UserContextType;

  const [userInventory, setUserInventory] = useState<any[]>([]);
  const [userCollectibleStates, setUserCollectibleStates] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

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
      <h2>Quest Exotics</h2>
      <div className="items-grid-inner">
        {items
          .filter((item: any) => {
            return item.name === "Hawkmoon" || item.name === "Dead Man's Tale";
          })
          .map((item) => {
            const {
              hash,
              collectibleHash,
              name,
              // description,
              icon,
              screenshot,
              itemTypeAndTier,
              // itemType,
              // itemTier,
              classType,
              // stats,
            } = item;

            const userOwned = userInventory?.filter((item) => item.itemHash === hash);

            const collectibleState = collectibleHash ? userCollectibleStates[collectibleHash] : {};

            // if collectibleState is odd, it's not been acquired
            const isAcquired = collectibleState?.state % 2 === 0 || false;

            const className = typeof classType === "number" ? classTypeMap[classType] : "";

            return (
              <div key={`${hash}_reward_card`} className="item-card">
                <div className="item-card-header">
                  <div>
                    <h3>{name}</h3>
                    <p>
                      {className} {itemTypeAndTier}
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
                      <Tooltip title={`You have at least 1 of these in your inventory`} arrow>
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
