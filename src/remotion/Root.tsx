import { Composition, Folder } from "remotion";
import { DealScanPromo } from "./DealScanPromo";
import { DemoScreencast } from "./DemoScreencast";
import { IsThisAScam, DealScoreReveal, RedFlagCheck } from "./UGCVideos";
import { UGCViralScam } from "./UGCViralScam";
import { UGCViralDealScore } from "./UGCViralDealScore";
import { UGCViralRedFlag } from "./UGCViralRedFlag";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="DealScan">
        <Composition
          id="DemoScreencast"
          component={DemoScreencast}
          durationInFrames={1200}
          fps={60}
          width={1920}
          height={1080}
        />
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
        <Composition
          id="UGCViralScam"
          component={UGCViralScam}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="UGCViralDealScore"
          component={UGCViralDealScore}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="UGCViralRedFlag"
          component={UGCViralRedFlag}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};

