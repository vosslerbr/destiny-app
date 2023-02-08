import Head from "next/head";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";

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

  // renders the images for the current lost sector's rewards
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
          className="image-rounded"
        />
      );
    });

    return rewards;
  };

  const renderShields = () => {
    const shieldsObject = lostSectorData.lostSector.modifiers.find((modifier: any) => {
      return modifier.displayProperties.name === "Shielded Foes";
    });

    const { description } = shieldsObject.displayProperties;

    let regex = /\[([^\]]+)\]/g;
    let match: RegExpExecArray | null;
    let shieldTypes: string[] = [];

    while ((match = regex.exec(description)) !== null) {
      shieldTypes.push(match[1]);
    }

    const shields = shieldTypes.map((shieldType: string) => {
      return (
        <Image
          src={`/${shieldType.toLowerCase()}.png`}
          alt={shieldType}
          width="48"
          height="48"
          key={`${shieldType}_image`}
          title={`${shieldType}`}
        />
      );
    });

    return shields;
  };

  const renderChampions = () => {
    const championsObject = lostSectorData.lostSector.modifiers.find((modifier: any) => {
      return modifier.displayProperties.name === "Champion Foes";
    });

    const championNameMap: { [key: string]: string } = {
      Disruption: "Overload",
      Stagger: "Unstoppable",
      Stun: "Barrier",
    };

    const { description } = championsObject.displayProperties;

    let regex = /\[([^\]]+)\]/g;
    let match: RegExpExecArray | null;
    let championTypes: string[] = [];

    while ((match = regex.exec(description)) !== null) {
      championTypes.push(match[1]);
    }

    const champions = championTypes.map((championType: string) => {
      const champName = championNameMap[championType];

      return (
        <Image
          src={`/${champName.toLowerCase()}.png`}
          alt={champName}
          width="48"
          height="48"
          key={`${champName}_image`}
          title={`${champName}`}
        />
      );
    });

    return champions;
  };

  // renders the images for the current lost sector's modifiers
  // ? shields and champions are filtered out since we'll represent them in the UI differently
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
        {lostSectorData ? (
          <div className="activity-card">
            <div>
              <div>
                <h2>{lostSectorData.lostSector.metadata.originalDisplayProperties.name}</h2>
                <h3>Today&apos;s Lost Sector</h3>
              </div>

              <div className="shields-container activity-metadata">
                <h4>Shields</h4>
                <div>{renderShields()}</div>
              </div>

              <div className="champions-container activity-metadata">
                <h4>Champions</h4>
                <div>{renderChampions()}</div>
              </div>

              <div className="rewards-container activity-metadata">
                <h4>Rewards</h4>
                <div>{renderRewards()}</div>
              </div>

              <div className="modifiers-container activity-metadata">
                <h4>Modifiers</h4>
                <div>{renderModifiers()}</div>
              </div>
            </div>

            <Image
              placeholder="blur"
              blurDataURL={`https://www.bungie.net${lostSectorData.lostSector.metadata.pgcrImage}`}
              src={`https://www.bungie.net${lostSectorData.lostSector.metadata.pgcrImage}`}
              alt={lostSectorData.lostSector.metadata.originalDisplayProperties.name}
              width="437"
              height="245"
              priority
              className="image-rounded"></Image>
          </div>
        ) : (
          <></>
        )}
      </main>
    </>
  );
}
