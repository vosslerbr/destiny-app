import LSChampions from "@/components/LSChampions";
import LSModifiers from "@/components/LSModifiers";
import LSRewards from "@/components/LSRewards";
import LSShields from "@/components/LSShields";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [lostSectorData, setLostSectorData] = useState<any>(null);

  useEffect(() => {
    // TODO try catch?
    const getLostSectorData = async () => {
      const res = await fetch("/api/lost-sector");
      const data = await res.json();

      setLostSectorData(data);
    };

    getLostSectorData();
  }, []);

  return (
    <>
      <Head>
        <title>Destiny App</title>
        <meta name="description" content="Destiny Lost Sector App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {lostSectorData && (
          <div className="activity-card">
            <div>
              <div>
                <h3>Today&apos;s Lost Sector is</h3>
                <h2>{lostSectorData.lostSector.metadata.originalDisplayProperties.name}</h2>
              </div>
              <Image
                placeholder="blur"
                blurDataURL={`https://www.bungie.net${lostSectorData.lostSector.metadata.pgcrImage}`}
                src={`https://www.bungie.net${lostSectorData.lostSector.metadata.pgcrImage}`}
                alt={lostSectorData.lostSector.metadata.originalDisplayProperties.name}
                width="437"
                height="245"
                priority
                className="image-rounded"
                id="ls-keyart"></Image>
            </div>

            <div>
              <LSRewards rewards={lostSectorData.lostSector.rewards} />
              <LSShields modifiers={lostSectorData.lostSector.modifiers} />
              <LSChampions modifiers={lostSectorData.lostSector.modifiers} />
              <LSModifiers modifiers={lostSectorData.lostSector.modifiers} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
