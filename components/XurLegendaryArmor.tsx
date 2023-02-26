import Link from "next/link";
import { useEffect, useState } from "react";

export default function XurLegendaryArmor({ items }: { items: any[] }) {
  const [armorSetName, setArmorSetName] = useState<string>("");

  useEffect(() => {
    // get the name of the first piece of legendary armor
    const getArmorSetName = () => {
      const armorSet = items.find((item: any) => {
        return item.itemTier === "Legendary Gear" && item.itemType === "Armor";
      });

      if (armorSet) {
        setArmorSetName(armorSet.name);
      }
    };

    getArmorSetName();
  }, [items]);

  return (
    <div className="rewards-container activity-metadata">
      <h4>Legendary Armor</h4>

      {armorSetName && <p>{armorSetName} set</p>}

      <p className="footnote">
        Legendary armor and rolls for other items can be seen on{" "}
        <Link href="/xur">Xur&apos;s detail page</Link>
      </p>
    </div>
  );
}
