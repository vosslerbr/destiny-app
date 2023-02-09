import Image from "next/image";

interface LSRewardsProps {
  rewards: any[];
}

export default function LSRewards({ rewards }: LSRewardsProps) {
  return (
    <div className="rewards-container activity-metadata">
      <h4>Rewards</h4>
      <div>
        {rewards.map((reward) => {
          const { icon, name } = reward.displayProperties;

          return (
            <Image
              src={`https://www.bungie.net${icon}`}
              alt={name}
              width="48"
              height="48"
              key={`${reward.collectibleHash}_image`}
              title={name}
              className="image-rounded"
            />
          );
        })}
      </div>
    </div>
  );
}
