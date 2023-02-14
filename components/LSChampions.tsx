import { Tooltip } from "@mui/material";
import Image from "next/image";

interface LSModifiersProps {
  modifiers: any[];
}

export default function LSChampions({ modifiers }: LSModifiersProps) {
  const championsObject = modifiers.find((modifier: any) => {
    return modifier.name === "Champion Foes";
  });

  const championNameMap: { [key: string]: string } = {
    Disruption: "Overload",
    Stagger: "Unstoppable",
    "Shield-Piercing": "Barrier",
  };

  const { description } = championsObject;

  let regex = /\[([^\]]+)\]/g;
  let match: RegExpExecArray | null;
  let championTypes: string[] = [];

  while ((match = regex.exec(description)) !== null) {
    championTypes.push(match[1]);
  }

  const champions = championTypes.map((championType: string) => {
    const champName = championNameMap[championType];

    return (
      <Tooltip title={champName} key={`${champName}_tooltip`}>
        <Image
          src={`/${champName.toLowerCase()}.png`}
          alt={champName}
          width="48"
          height="48"
          key={`${champName}_image`}
        />
      </Tooltip>
    );
  });

  return (
    <div className="champions-container activity-metadata">
      <h4>Champions</h4>
      <div>{champions}</div>
    </div>
  );
}
