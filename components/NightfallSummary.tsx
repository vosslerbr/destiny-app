import { NightfallData } from "@/global";
import useSWR from "swr";
import fetcher from "@/helpers/fetcher";
import Shields from "./Shields";
import Champions from "./Champions";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modifiers from "./Modifiers";
import CardLoading from "./CardLoading";
import Link from "next/link";
import { Tooltip } from "@mui/material";

export default function NightfallSummary() {
  const { data: nightfallData }: { data: NightfallData } = useSWR("/api/nightfall", fetcher);

  return (
    <>
      {nightfallData ? (
        <div
          className="section-card"
          style={{
            backgroundImage: `url(https://www.bungie.net${nightfallData.keyart})`,
          }}>
          <div className="section-card-inner">
            <Tooltip title="View details" placement="left" arrow>
              <Link href="/nightfall">
                <div>
                  <h3>This week&apos;s Nightfall is</h3>
                  <h2>{nightfallData.name}</h2>
                </div>
              </Link>
            </Tooltip>
            {/* we only need these once, so just grab from master */}
            <Shields modifiers={nightfallData.difficulties[3].modifiers} />
            <Champions modifiers={nightfallData.difficulties[3].modifiers} />

            {nightfallData.difficulties.map((difficulty: any) => {
              return (
                <div key={difficulty.detailedName}>
                  <Accordion
                    sx={{
                      backgroundColor: "transparent",
                      color: "rgba(255, 255, 255, 0.5)",
                      boxShadow: "none",
                    }}>
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon
                          sx={{
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        />
                      }
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      sx={{
                        border: "none",
                        paddingLeft: "0rem",
                      }}>
                      <Typography>{difficulty.detailedName} Modifiers</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        paddingLeft: "0rem",
                        paddingRight: "0rem",
                      }}>
                      <Modifiers modifiers={difficulty.modifiers} showTitle={false} />
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <CardLoading dataName="nightfalls" />
      )}
    </>
  );
}
