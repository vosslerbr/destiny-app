import { Dialog, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

interface LSRewardsProps {
  rewards: any[];
}

const classTypeMap: { [key: number]: string } = {
  0: "Titan",
  1: "Hunter",
  2: "Warlock",
};

export default function LSRewards({ rewards }: LSRewardsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  const handleClose = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="rewards-container activity-metadata">
      <h4>Rewards</h4>
      <div>
        {rewards.map((reward) => {
          const { icon, name } = reward.displayProperties;

          return (
            <Tooltip title={name} key={`${reward.collectibleHash}_tooltip`}>
              <Image
                src={`https://www.bungie.net${icon}`}
                alt={name}
                width="48"
                height="48"
                key={`${reward.collectibleHash}_image`}
                className="image-rounded"
                onClick={() => {
                  setModalContent(reward);
                  setModalOpen(true);
                }}
              />
            </Tooltip>
          );
        })}
      </div>
      {modalContent && (
        <Dialog open={modalOpen} onClose={handleClose}>
          <DialogTitle>{modalContent.displayProperties.name}</DialogTitle>
          <DialogContent>
            <p>
              {classTypeMap[modalContent.classType]} {modalContent.itemTypeAndTierDisplayName}
            </p>
            <Image
              src={`https://www.bungie.net${modalContent.displayProperties.icon}`}
              alt={modalContent.displayProperties.name}
              width="96"
              height="96"
              className="image-rounded"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
