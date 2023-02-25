import { Tooltip } from "@mui/material";
import Image from "next/image";

export default function XurLegendaryArmor({ items }: any) {
  return (
    <div className="rewards-container activity-metadata">
      <h4>Legendary Armor</h4>
      <div>
        {items
          .filter((item: any) => {
            return item.itemTier === "Legendary Gear" && item.itemType === "Armor";
          })
          .map((item: any) => {
            const { icon, name } = item;

            return (
              <Tooltip title={name} key={`${name}_tooltip`} arrow>
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
