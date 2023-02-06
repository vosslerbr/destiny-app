import Head from "next/head";
import Image from "next/image";
import { Fragment, ReactNode, useEffect, useState } from "react";

export default function Home() {
  const [lostSectorData, setLostSectorData] = useState<any>(null);

  useEffect(() => {
    const getLostSectorData = async () => {
      const res = await fetch("/api/lost-sector");
      const data = await res.json();

      setLostSectorData(data);
    };

    getLostSectorData();
  }, []);

  const renderRewards = () => {
    const rewards: ReactNode[] = lostSectorData.lostSector.rewards.map((reward: any) => {
      const { icon, name } = reward.displayProperties;

      return (
        <Image
          src={`https://www.bungie.net${icon}`}
          alt={name}
          width="48"
          height="48"
          key={`${reward.collectibleHash}_image`}
          title={name}
        />
      );
    });

    return rewards;
  };

  const renderModifiers = () => {
    const modifiers: ReactNode[] = lostSectorData.lostSector.modifiers
      .filter((modifier: any) => {
        // Filter out the "Shielded Foes" and "Champion Foes" modifiers as well as any modifiers without an icon
        const { name, icon } = modifier.displayProperties;

        const notShieldedFoes = name !== "Shielded Foes";
        const notChampionFoes = name !== "Champion Foes";

        return icon && notShieldedFoes && notChampionFoes;
      })
      .map((modifier: any) => {
        const { icon, name, description } = modifier.displayProperties;

        return (
          <Image
            src={`https://www.bungie.net${icon}`}
            alt={name}
            width="48"
            height="48"
            key={`${modifier.hash}_image`}
            title={`${name}\n\n${description}`}
          />
        );
      });

    return modifiers;
  };

  return (
    <>
      <Head>
        <title>Destiny App</title>
        <meta name="description" content="Destiny Lost Sector App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Destiny Lost Sector App</h1>

        {lostSectorData ? (
          <div>
            <h2>{lostSectorData.lostSector.metadata.originalDisplayProperties.name}</h2>

            <Image
              placeholder="blur"
              blurDataURL={`https://www.bungie.net${lostSectorData.lostSector.metadata.pgcrImage}`}
              src={`https://www.bungie.net${lostSectorData.lostSector.metadata.pgcrImage}`}
              alt={lostSectorData.lostSector.metadata.originalDisplayProperties.name}
              width="437"
              height="245"></Image>

            <div>{renderRewards()}</div>

            <div>{renderModifiers()}</div>
          </div>
        ) : (
          <></>
        )}
      </main>
    </>
  );
}
