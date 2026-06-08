import { Composition, Folder } from "remotion";
import { DealScanPromo } from "./DealScanPromo";

export const RemotionRoot = () => {
  return (
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
  );
};
