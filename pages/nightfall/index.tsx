import Head from "next/head";

export default function NightfallDetail() {
  return (
    <>
      <Head>
        <title>Nightfall: {}</title>
        <meta
          name="description"
          content="A web app for viewing the latest activity and vendor rotations in Destiny 2"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>NIGHTFALL DETAIL PAGE</div>
    </>
  );
}
