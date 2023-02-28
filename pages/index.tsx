import Head from "next/head";
import LostSectorSummary from "@/components/LostSectorSummary";
import XurSummary from "@/components/XurSummary";
import NightfallSummary from "@/components/NightfallSummary";
import GrandmasterSummary from "@/components/GrandmasterSummary";
import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import Layout from "@/components/Layout";

const Home: NextPageWithLayout = () => {
  // when page loads, we need to check for a 'code' query param since this is our callback URL

  return (
    <>
      <Head>
        <title>Yet Another Destiny App</title>
        <meta
          name="description"
          content="A web app for viewing the latest activity and vendor rotations in Destiny 2"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <LostSectorSummary />
        <XurSummary />
        <NightfallSummary />
        <GrandmasterSummary />
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
