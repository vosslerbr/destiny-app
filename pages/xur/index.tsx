import CharacterSelect from "@/components/CharacterSelect";
import Layout from "@/components/Layout";
import { UserContext, UserContextType } from "@/components/Store";
import XurExoticsDetail from "@/components/XurExoticsDetail";
import XurLegArmorDetail from "@/components/XurLegArmorDetail";
import XurLegWeaponsDetail from "@/components/XurLegWeaponsDetail";
import XurQuestExoticsDetail from "@/components/XurQuestExoticsDetail";
import { LinearProgress, Tooltip } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { ReactElement, useContext, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";

const XurDetail: NextPageWithLayout = () => {
  const { user } = useContext(UserContext) as UserContextType;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [xur, setXur] = useState<any>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");

  const handleCharacterChange = (characterId: string) => {
    console.log(characterId);

    setSelectedCharacterId(characterId);
  };

  const getXurData = async () => {
    const res = await axios.get("/api/xur");
    const data = res.data;

    setXur(data);

    setIsLoading(false);
  };

  const getXurForProfile = async () => {
    const tokenData = localStorage.getItem("tokenData");

    if (tokenData) {
      const parsedTokenData = JSON.parse(tokenData);

      const membershipType = user.destinyMemberships.find(
        (membership) => membership.membershipId === user.primaryMembershipId
      )?.membershipType;

      const response = await axios.post("/api/xur/for-profile", {
        membershipType,
        membershipId: user.primaryMembershipId,
        access_token: parsedTokenData.access_token,
        characterId: selectedCharacterId,
      });

      const { data } = response;

      setXur(data);
    }

    setIsLoading(false);
  };

  // when selectedCharacterId changes, fetch Xur's inventory
  useEffect(() => {
    setIsLoading(true);

    if (!user.primaryMembershipId || !selectedCharacterId) {
      getXurData();

      // TODO show public Xur inventory
      return;
    }

    getXurForProfile();
  }, [selectedCharacterId]);

  return (
    <>
      <Head>
        <title>Xur</title>
        <meta
          name="description"
          content="A web app for viewing the latest activity and vendor rotations in Destiny 2"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <p className="dev-warning">
          <span>Heads up!</span> This page is under development and may not work as expected.
        </p>

        {isLoading && !xur ? (
          <LinearProgress />
        ) : (
          <>
            <div
              className="section-card"
              style={{
                backgroundImage: `url(https://www.bungie.net${xur?.xur?.keyart})`,
                minHeight: "350px",
                backgroundPositionY: "top",
              }}>
              <div
                className="section-card-inner"
                style={{
                  minHeight: "350px",
                  minWidth: "40%",
                }}>
                <Tooltip title="View details" placement="left" arrow>
                  <div>
                    <h3>Leaves Tuesday at </h3>
                    <h2>{xur?.xur?.name}</h2>
                  </div>
                </Tooltip>
              </div>
            </div>
            {user.primaryMembershipId && (
              <CharacterSelect
                handleChange={(charId: string) => handleCharacterChange(charId)}
                selectedCharacterId={selectedCharacterId}
              />
            )}

            <XurExoticsDetail items={xur?.items || []} />
            <XurQuestExoticsDetail items={xur?.items || []} />
            <XurLegWeaponsDetail items={xur?.items || []} />
            <XurLegArmorDetail items={xur?.items || []} />
          </>
        )}
      </main>
    </>
  );
};

XurDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default XurDetail;
