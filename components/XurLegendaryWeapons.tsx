import { Tooltip } from "@mui/material";
import Image from "next/image";

export default function XurLegendaryWeapons({ items }: any) {
  return (
    <div className="rewards-container activity-metadata">
      <h4>Legendary Weapons</h4>
      <div>
        {items
          .filter((item: any) => {
            return item.itemTier === "Legendary Gear" && item.itemType === "Weapon";
          })
          .map((item: any) => {
            const { icon, name } = item;

            return (
              <Tooltip title={name} key={`${name}_tooltip`}>
                <Image
                  src={`https://www.bungie.net${icon}`}
                  alt={name || "Reward"}
                  width="48"
                  height="48"
                  key={`${name}_image`}
                  className="image-rounded reward-image"
                />
              </Tooltip>
            );
          })}
      </div>
    </div>
  );
}
