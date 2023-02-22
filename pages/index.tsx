import Head from "next/head";
import LostSectorSummary from "@/components/LostSectorSummary";
import XurSummary from "@/components/XurSummary";
import NightfallSummary from "@/components/NightfallSummary";
import GrandmasterSummary from "@/components/GrandmasterSummary";

export default function Home() {
  return (
    <>
      <Head>
        <title>Destiny App</title>
        <meta name="description" content="Destiny Lost Sector App" />
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
}
