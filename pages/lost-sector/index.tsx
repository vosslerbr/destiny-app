import Champions from "@/components/Champions";
import Layout from "@/components/Layout";
import Modifiers from "@/components/Modifiers";
import RewardsDetail from "@/components/RewardsDetail";
import Shields from "@/components/Shields";
import { LostSectorData } from "@/global";
import fetcher from "@/helpers/fetcher";
import { CircularProgress } from "@mui/material";
import Head from "next/head";
import { ReactElement } from "react";
import useSWR from "swr";
import { NextPageWithLayout } from "../_app";

const LostSectorDetail: NextPageWithLayout = () => {
  const { data: lostSectorData }: { data: LostSectorData; isLoading: boolean } = useSWR(
    "/api/lost-sector",
    fetcher
  );

  return (
    <>
      <Head>
        <title>Lost Sector: {lostSectorData.name}</title>
        <meta
          name="description"
          content="A web app for viewing the latest activity and vendor rotations in Destiny 2"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {lostSectorData ? (
          <>
            <div
              className="section-card-detail"
              style={{
                backgroundImage: `url(https://www.bungie.net${lostSectorData.keyArt})`,
              }}>
              <div className="section-card-inner">
                <div>
                  <h1>{lostSectorData.name}</h1>
                  {/* <h2>Location, Place</h2> */}
                </div>

                <Shields modifiers={lostSectorData.modifiers} />
                <Champions modifiers={lostSectorData.modifiers} />
                <Modifiers modifiers={lostSectorData.modifiers} />
              </div>
            </div>
            <RewardsDetail rewards={lostSectorData.rewards} />
          </>
        ) : (
          <CircularProgress />
        )}
      </main>
    </>
  );
};

LostSectorDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LostSectorDetail;
