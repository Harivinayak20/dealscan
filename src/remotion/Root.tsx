import { Composition, Folder } from "remotion";
import { DealScanPromo } from "./DealScanPromo";
import { IsThisAScam, DealScoreReveal, RedFlagCheck } from "./UGCVideos";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="DealScan">
        <Composition
          id="DealScanPromo"
          component={DealScanPromo}
          durationInFrames={3600}
          fps={60}
          width={3840}
          height={2160}
          defaultProps={{
            musicFile: null,
          }}
        />
      </Folder>
      <Folder name="UGC">
        <Composition
          id="IsThisAScam"
          component={IsThisAScam}
          durationInFrames={1200}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="DealScoreReveal"
          component={DealScoreReveal}
          durationInFrames={900}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="RedFlagCheck"
          component={RedFlagCheck}
          durationInFrames={1000}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};

