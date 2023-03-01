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
  const { data, isLoading }: { data: LostSectorData; isLoading: boolean } = useSWR(
    "/api/lost-sector",
    fetcher
  );

  return (
    <>
      <Head>
        <title>Lost Sector: {data?.name}</title>
        <meta
          name="description"
          content="A web app for viewing the latest activity and vendor rotations in Destiny 2"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!isLoading ? (
          <>
            <div
              className="section-card-detail"
              style={{
                backgroundImage: `url(https://www.bungie.net${data.activity.pgcrImage})`,
              }}>
              <div className="section-card-inner">
                <div>
                  <h1>{data.name}</h1>
                  {/* <h2>Location, Place</h2> */}
                </div>

                <Shields modifiers={data.activity.modifiers} />
                <Champions modifiers={data.activity.modifiers} />
                <Modifiers modifiers={data.activity.modifiers} />
              </div>
            </div>
            <RewardsDetail rewards={data.rewards} />
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
