import { Tooltip } from "@mui/material";
import { ActivityModifier, ActivityModifiersOnActivity } from "@prisma/client";
import Image from "next/image";

interface LSModifiersProps {
  modifiers: (ActivityModifiersOnActivity & { activityModifier: ActivityModifier })[];
  showTitle?: boolean;
}

export default function LSModifiers({ modifiers, showTitle = true }: LSModifiersProps) {
  return (
    <div className="modifiers-container activity-metadata">
      {showTitle && <h4>Modifiers</h4>}

      <div>
        {modifiers
          .filter((modifier) => {
            // Filter out the "Shielded Foes" and "Champion Foes" modifiers as well as any modifiers without an icon
            const { name, icon } = modifier.activityModifier;

            const notShieldedFoes = name !== "Shielded Foes";
            const notChampionFoes = name !== "Champion Foes";
            const notVanguardRank = name !== "Increased Vanguard Rank";
            const notDoubleDrops = name !== "Double Nightfall Drops";

            return icon && notShieldedFoes && notChampionFoes && notVanguardRank && notDoubleDrops;
          })
          .map((modifier) => {
            const { icon, name, description, hash } = modifier.activityModifier;

            return (
              <Tooltip title={`${name}: ${description}`} key={`${hash}_tooltip`}>
                <Image
                  src={`https://www.bungie.net${icon}`}
                  alt={name || "modifier"}
                  width="48"
                  height="48"
                  key={`${name}_image`}
                />
              </Tooltip>
            );
          })}
      </div>
    </div>
  );
}
