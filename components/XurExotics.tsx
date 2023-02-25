import { Tooltip } from "@mui/material";
import Image from "next/image";

export default function XurExotics({ items }: any) {
  return (
    <div className="rewards-container activity-metadata">
      <h4>Exotics</h4>
      <div>
        {items
          .filter((item: any) => {
            return (
              item.itemTier === "Exotic Gear" &&
              item.name !== "Hawkmoon" &&
              item.name !== "Dead Man's Tale"
            );
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
