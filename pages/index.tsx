import LSChampions from "@/components/LSChampions";
import LSModifiers from "@/components/LSModifiers";
import LSRewards from "@/components/LSRewards";
import LSShields from "@/components/LSShields";
import { LostSectorData } from "@/global";
import { CircularProgress, Tooltip } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [lostSectorData, setLostSectorData] = useState<LostSectorData | null>(null);
  const [xurData, setXurData] = useState<any>(null);

  useEffect(() => {
    // TODO try catch?

    const getLostSectorData = async () => {
      const res = await fetch("/api/lost-sector");
      const data = await res.json();

      const lsData: LostSectorData = data.lostSector;

      setLostSectorData(lsData);
    };

    const getXurData = async () => {
      const res = await fetch("/api/xur");
      const data = await res.json();

      setXurData(data);
    };

    getLostSectorData();
    getXurData();
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
        {lostSectorData ? (
          <div className="activity-card">
            <div>
              <div>
                <h3>Today&apos;s Lost Sector is</h3>
                <h2>{lostSectorData.name}</h2>
              </div>
              <Image
                placeholder="blur"
                blurDataURL={`https://www.bungie.net${lostSectorData.keyArt}`}
                src={`https://www.bungie.net${lostSectorData.keyArt}`}
                alt={lostSectorData.name}
                width="437"
                height="245"
                priority
                className="image-rounded"
                id="ls-keyart"></Image>
            </div>

            <div>
              <LSRewards rewards={lostSectorData.rewards} />
              <LSShields modifiers={lostSectorData.modifiers} />
              <LSChampions modifiers={lostSectorData.modifiers} />
              <LSModifiers modifiers={lostSectorData.modifiers} />
            </div>
          </div>
        ) : (
          // TODO loading component
          <CircularProgress />
        )}

        {xurData ? (
          <div className="activity-card">
            <div>
              <div>
                <h3>Xur</h3>
              </div>
            </div>

            <div>
              {xurData.items.map((item: any) => {
                return (
                  <div key={item.name}>
                    <Tooltip title={item.name}>
                      <Image
                        src={`https://www.bungie.net${item.icon}`}
                        alt={item.name}
                        width="48"
                        height="48"
                      />
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // TODO loading component
          <CircularProgress />
        )}
      </main>
    </>
  );
}
