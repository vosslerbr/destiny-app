import { Tooltip } from "@mui/material";
import Image from "next/image";

interface LSModifiersProps {
  modifiers: any[];
}

export default function LSModifiers({ modifiers }: LSModifiersProps) {
  return (
    <div className="modifiers-container activity-metadata">
      <h4>Modifiers</h4>
      <div>
        {modifiers
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
              <Tooltip title={`${name}: ${description}`} key={`${modifier.hash}_tooltip`}>
                <Image
                  src={`https://www.bungie.net${icon}`}
                  alt={name}
                  width="48"
                  height="48"
                  key={`${modifier.hash}_image`}
                />
              </Tooltip>
            );
          })}
      </div>
    </div>
  );
}
