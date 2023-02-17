import classTypeMap from "@/helpers/classTypeMap";
import { Dialog, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

interface LSRewardsProps {
  rewards: any[];
}

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
          const { icon, name } = reward.inventoryItem;

          return (
            <Tooltip title={name} key={`${reward.name}_tooltip`}>
              <Image
                src={`https://www.bungie.net${icon}`}
                alt={name}
                width="48"
                height="48"
                key={`${reward.name}_image`}
                className="image-rounded reward-image"
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
          <DialogTitle>{modalContent.inventoryItem.name}</DialogTitle>
          <DialogContent>
            <p>
              {classTypeMap[modalContent.inventoryItem.classType]}{" "}
              {modalContent.inventoryItem.itemTypeAndTierDisplayName}
            </p>

            <div className="modal-image-container">
              <Image
                src={`https://www.bungie.net${modalContent.inventoryItem.screenshot}`}
                blurDataURL={`https://www.bungie.net${modalContent.inventoryItem.screenshot}`}
                alt={modalContent.inventoryItem.name}
                fill={true}
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
