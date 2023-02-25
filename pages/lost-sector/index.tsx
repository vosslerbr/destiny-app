import Champions from "@/components/Champions";
import Layout from "@/components/Layout";
import Modifiers from "@/components/Modifiers";
import RewardsDetail from "@/components/RewardsDetail";
import Shields from "@/components/Shields";
import { UserContext, UserContextType } from "@/components/Store";
import { LostSectorData } from "@/global";
import fetcher from "@/helpers/fetcher";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { ReactElement, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { NextPageWithLayout } from "../_app";

const LostSectorDetail: NextPageWithLayout = () => {
  const { data: lostSectorData }: { data: LostSectorData; isLoading: boolean } = useSWR(
    "/api/lost-sector",
    fetcher
  );
  const { user } = useContext(UserContext) as UserContextType;
  const [userInventories, setUserInventories] = useState<any[]>([]);
  const [userCollectibleStates, setUserCollectibleStates] = useState<any>({});

  useEffect(() => {
    if (!user.primaryMembershipId) {
      return;
    }

    const getUserInventories = async () => {
      const tokenData = localStorage.getItem("tokenData");

      if (tokenData) {
        const parsedTokenData = JSON.parse(tokenData);

        const response = await axios.post("/api/profile-inventories", {
          membershipId: user.primaryMembershipId,
          access_token: parsedTokenData.access_token,
        });

        const { data } = response;

        setUserInventories(data.combinedInventory);
        setUserCollectibleStates(data.collectibleStates);
      }
    };

    getUserInventories();
  }, [user]);

  return (
    <main>
      {lostSectorData ? (
        <>
          <div
            className="activity-card-detail"
            style={{
              backgroundImage: `url(https://www.bungie.net${lostSectorData.keyArt})`,
            }}>
            <div className="activity-card-inner">
              <div>
                <h1>{lostSectorData.name}</h1>
                <h2>Location, Place</h2>
              </div>

              <Shields modifiers={lostSectorData.modifiers} />
              <Champions modifiers={lostSectorData.modifiers} />
              <Modifiers modifiers={lostSectorData.modifiers} />
            </div>
          </div>
          <RewardsDetail
            rewards={lostSectorData.rewards}
            userInventory={userInventories}
            userCollectibleStates={userCollectibleStates}
          />
        </>
      ) : (
        <CircularProgress />
      )}
    </main>
  );
};

LostSectorDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LostSectorDetail;
