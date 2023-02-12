import { Tooltip } from "@mui/material";
import Image from "next/image";

interface LSModifiersProps {
  modifiers: any[];
}

export default function LSShields({ modifiers }: LSModifiersProps) {
  const shieldsObject = modifiers.find((modifier: any) => {
    return modifier.name === "Shielded Foes";
  });

  const { description } = shieldsObject;

  let regex = /\[([^\]]+)\]/g;
  let match: RegExpExecArray | null;
  let shieldTypes: string[] = [];

  while ((match = regex.exec(description)) !== null) {
    shieldTypes.push(match[1]);
  }

  const shields = shieldTypes.map((shieldType: string) => {
    return (
      <Tooltip title={shieldType} key={`${shieldType}_tooltip`}>
        <Image
          src={`/${shieldType.toLowerCase()}.png`}
          alt={shieldType}
          width="48"
          height="48"
          key={`${shieldType}_image`}
        />
      </Tooltip>
    );
  });

  return (
    <div className="shields-container activity-metadata">
      <h4>Shields</h4>
      <div>{shields}</div>
    </div>
  );
}
