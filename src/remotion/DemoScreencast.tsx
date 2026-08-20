import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 20s (1200f @ 60fps) product demo for dealscan.dev.
//
// Scenes 1-3 are the real site captured at 2x, flown through with a virtual
// camera, with the typing and cursor drawn live on top so the interaction
// animates instead of cutting between stills. Scene 4 rebuilds the deal card
// natively so the score ring, counter and flags can actually animate. All
// sound is synthesised in scratchpad/sfx.js: no third-party assets.

const W = 1920;
const H = 1080;

const T = {
  paper: "#F7F1E9",
  surface: "#FFFDFA",
  ink: "#1a1512",
  muted: "#6b6157",
  line: "#E7DED2",
  orange: "#B4501F",
  green: "#2F8F63",
  greenSoft: "#E6F1EA",
  amber: "#B0821F",
  dark: "#14100C",
};
const FONT = 'Archivo, Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

// Master gain on the whole audio bus. The mix was written at conservative
// levels, so this lifts it to roughly -2 dBFS peak for social playback.
const MIX = 1.9;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.32, 0, 0.12, 1);

// ---- timeline -------------------------------------------------------------
const S1 = 0;
const S2 = 150; // cursor + typing
const CLICK_INPUT = 235;
const TYPE_START = 245;
const TYPED = "autotrader.com/2019-toyota-camry-se";
const CHAR_F = 3.5;
const TYPE_END = TYPE_START + TYPED.length * CHAR_F;
const CLICK_BTN = 425;
const S3 = 445; // analysing
const S4 = 570; // score card
const RING_A = 625;
const RING_B = 700;
const CHIP_F = [620, 633, 646];
const FLAG_F = [710, 728, 746];
const S5 = 900; // vin report
const S6 = 1070; // end card
const END = 1200;

// live element rects, measured from the real page with puppeteer
const INPUT = { x: 464.2, y: 551.5, w: 168, h: 50 };
const BUTTON = { x: 640.2, y: 551.5, w: 282.8, h: 50 };

type Key = { f: number; s: number; x: number; y: number };
const camera = (frame: number, keys: Key[]): React.CSSProperties => {
  const fs = keys.map((k) => k.f);
  const s = interpolate(frame, fs, keys.map((k) => k.s), { ...clamp, easing: ease });
  const x = interpolate(frame, fs, keys.map((k) => k.x), { ...clamp, easing: ease });
  const y = interpolate(frame, fs, keys.map((k) => k.y), { ...clamp, easing: ease });
  return {
    position: "absolute",
    left: 0,
    top: 0,
    transform: `translate(${W / 2 - x * s}px, ${H / 2 - y * s}px) scale(${s})`,
    transformOrigin: "0 0",
  };
};

const Chrome = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: -72,
      width: W,
      height: 72,
      background: "#EFE7DB",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottom: `1px solid ${T.line}`,
      display: "flex",
      alignItems: "center",
      paddingLeft: 28,
      gap: 12,
    }}
  >
    {["#E5A09A", "#E8CE9B", "#A9CDA9"].map((c) => (
      <div key={c} style={{ width: 15, height: 15, borderRadius: 99, background: c }} />
    ))}
    <div
      style={{
        marginLeft: 26,
        background: T.surface,
        border: `1px solid ${T.line}`,
        borderRadius: 99,
        padding: "8px 26px",
        fontFamily: FONT,
        fontSize: 20,
        color: T.muted,
        fontWeight: 600,
      }}
    >
      dealscan.dev
    </div>
  </div>
);

const Cursor = ({ x, y, press }: { x: number; y: number; press: number }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 40, pointerEvents: "none" }}>
    <svg width={30} height={30} viewBox="0 0 24 24" style={{ transform: `scale(${1 - press * 0.2})`, filter: "drop-shadow(0 3px 7px rgba(0,0,0,.35))" }}>
      <path d="M5.5 3.2v16.2l3.9-3.4 2.2 5 2.6-1.1-2.2-5h5.2z" fill={T.ink} stroke="#fff" strokeWidth={1.5} />
    </svg>
  </div>
);

const Ripple = ({ x, y, t }: { x: number; y: number; t: number }) => {
  if (t <= 0 || t >= 1) return null;
  const r = 8 + t * 40;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `${2.5 * (1 - t)}px solid ${T.orange}`,
        opacity: 1 - t,
        zIndex: 35,
      }}
    />
  );
};

// Caption that reveals word by word instead of fading in as a block.
const Caption = ({ text, start, end }: { text: string; start: number; end: number }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;
  const words = text.split(" ");
  const out = interpolate(frame, [end - 16, end - 2], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", bottom: 58, width: W, display: "flex", justifyContent: "center", zIndex: 60, opacity: out }}>
      <div
        style={{
          background: "rgba(20,16,12,0.93)",
          borderRadius: 999,
          padding: "15px 34px",
          display: "flex",
          gap: 11,
          boxShadow: "0 12px 40px rgba(0,0,0,.28)",
        }}
      >
        {words.map((w, i) => {
          const a = interpolate(frame, [start + 6 + i * 4, start + 20 + i * 4], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 31,
                color: "#F7F1E9",
                opacity: a,
                display: "inline-block",
                transform: `translateY(${(1 - a) * 14}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Native rebuild of the product's own sample deal card, so every element can animate.
const DealCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - S4, fps, config: { damping: 16, mass: 0.9 } });

  const ringP = interpolate(frame, [RING_A, RING_B], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.9, 0.2, 1) });
  const score = Math.round(82 * ringP);
  const R = 74;
  const C = 2 * Math.PI * R;

  const shimmer = interpolate(frame, [S4 + 20, S4 + 80], [-40, 140], clamp);
  const chip = (i: number) => spring({ frame: frame - CHIP_F[i], fps, config: { damping: 13, mass: 0.6 } });
  const flag = (i: number) => spring({ frame: frame - FLAG_F[i], fps, config: { damping: 14, mass: 0.7 } });
  // Skeleton rows hold the right column while the score is still counting, so
  // the card never reads as half-empty.
  const skel = interpolate(frame, [S4 + 14, S4 + 30], [0, 1], clamp);
  const shimX = interpolate(frame % 50, [0, 50], [-30, 130], clamp);
  const Skeleton = ({ w, h, o }: { w: number | string; h: number; o: number }) => (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 99, background: T.paper, opacity: o, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shimX}%`, width: "40%", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.75), rgba(255,255,255,0))", transform: "skewX(-14deg)" }} />
    </div>
  );

  const flags = [
    { c: T.green, t: "$1,400 below market average" },
    { c: T.green, t: "Clean title, single owner" },
    { c: T.amber, t: "Mileage not verified against records" },
  ];

  return (
    <div
      style={{
        width: 1080,
        background: T.surface,
        borderRadius: 30,
        border: `1px solid ${T.line}`,
        boxShadow: "0 40px 110px rgba(60,40,20,.20)",
        padding: 34,
        transform: `translateY(${(1 - rise) * 70}px) scale(${0.94 + rise * 0.06})`,
        opacity: Math.min(1, rise * 1.6),
      }}
    >
      {/* listing photo plate with a light sweep */}
      <div style={{ position: "relative", height: 260, borderRadius: 18, overflow: "hidden", background: `repeating-linear-gradient(135deg, #EFE4D2 0 22px, #E6D9C3 22px 44px)` }}>
        <div style={{ position: "absolute", left: 22, top: 20, background: T.surface, borderRadius: 99, padding: "9px 20px", fontFamily: FONT, fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, background: T.orange, display: "inline-block" }} />
          AutoTrader
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${shimmer}%`,
            width: "26%",
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-14deg)",
          }}
        />
      </div>

      {/* title row */}
      {(() => {
        const a = interpolate(frame, [S4 + 22, S4 + 46], [0, 1], clamp);
        return (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26, opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: T.ink }}>2019 Toyota Camry SE</div>
              <div style={{ fontFamily: FONT, fontSize: 22, color: T.muted, marginTop: 8 }}>Listed 6 days ago · 12 mi away</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: T.ink }}>$18,400</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: T.green, marginTop: 6 }}>≈ $1,400 under</div>
            </div>
          </div>
        );
      })()}

      {/* chips */}
      <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
        {["42,300 mi", "Clean title", "1 owner"].map((c, i) => (
          <div
            key={c}
            style={{
              background: T.paper,
              borderRadius: 99,
              padding: "11px 22px",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 21,
              color: T.ink,
              transform: `scale(${0.7 + chip(i) * 0.3})`,
              opacity: chip(i),
            }}
          >
            {c}
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: T.line, margin: "30px 0 28px" }} />

      {/* score + flags */}
      <div style={{ display: "flex", alignItems: "center", gap: 46 }}>
        <div style={{ position: "relative", width: 176, height: 176, flexShrink: 0 }}>
          <svg width={176} height={176} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={88} cy={88} r={R} fill="none" stroke={T.line} strokeWidth={13} />
            <circle
              cx={88}
              cy={88}
              r={R}
              fill="none"
              stroke={T.green}
              strokeWidth={13}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - ringP * 0.82)}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: T.ink, lineHeight: 1 }}>{score}</div>
            <div style={{ fontFamily: FONT, fontSize: 19, color: T.muted, marginTop: 4 }}>out of 100</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {(() => {
            const b = spring({ frame: frame - RING_B - 2, fps, config: { damping: 12, mass: 0.6 } });
            return (
              <div style={{ position: "relative", height: 48 }}>
                <div style={{ position: "absolute", inset: 0, opacity: (1 - b) * skel }}>
                  <Skeleton w={168} h={44} o={1} />
                </div>
                <div style={{ position: "absolute", display: "inline-block", background: T.greenSoft, color: T.green, fontFamily: FONT, fontWeight: 800, fontSize: 24, padding: "10px 24px", borderRadius: 99, transform: `scale(${0.8 + b * 0.2})`, opacity: b }}>
                  Great deal
                </div>
              </div>
            );
          })()}
          <div style={{ marginTop: 16 }}>
            {flags.map((f, i) => (
              <div key={f.t} style={{ position: "relative", height: 41, marginBottom: 15 }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 15, opacity: (1 - flag(i)) * skel }}>
                  <Skeleton w={13} h={13} o={1} />
                  <Skeleton w={[430, 360, 520][i]} h={22} o={1} />
                </div>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 15, opacity: flag(i), transform: `translateX(${(1 - flag(i)) * 26}px)` }}>
                  <span style={{ width: 13, height: 13, borderRadius: 99, background: f.c, flexShrink: 0 }} />
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: f.c === T.amber ? T.amber : T.ink, whiteSpace: "nowrap" }}>{f.t}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DemoScreencast = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- scene 1-3 world camera ----
  const cam = camera(frame, [
    { f: S1, s: 0.64, x: 960, y: 400 },
    { f: 130, s: 0.7, x: 960, y: 430 },
    { f: 210, s: 1.45, x: 700, y: 566 },
    { f: 260, s: 1.72, x: 640, y: 576 },
    { f: 390, s: 1.72, x: 660, y: 576 },
    { f: CLICK_BTN + 8, s: 1.78, x: 730, y: 576 },
    { f: S3 + 40, s: 1.24, x: 880, y: 556 },
    { f: S4, s: 1.18, x: 900, y: 550 },
  ]);

  // ---- cursor path ----
  const cx = interpolate(frame, [S2, 230, TYPE_END + 6, CLICK_BTN - 4], [1290, INPUT.x + 96, INPUT.x + 96, BUTTON.x + BUTTON.w / 2], { ...clamp, easing: ease });
  const cy = interpolate(frame, [S2, 230, TYPE_END + 6, CLICK_BTN - 4], [880, INPUT.y + 32, INPUT.y + 32, BUTTON.y + 30], { ...clamp, easing: ease });
  const press = Math.max(
    interpolate(frame, [CLICK_INPUT - 4, CLICK_INPUT, CLICK_INPUT + 6], [0, 1, 0], clamp),
    interpolate(frame, [CLICK_BTN - 4, CLICK_BTN, CLICK_BTN + 6], [0, 1, 0], clamp),
  );

  const nChars = Math.floor(interpolate(frame, [TYPE_START, TYPE_END], [0, TYPED.length], clamp));
  const caret = frame < TYPE_END + 10 && Math.floor(frame / 16) % 2 === 0;
  const focus = interpolate(frame, [CLICK_INPUT, CLICK_INPUT + 8], [0, 1], clamp);

  // button press + scan sweep
  const btnPress = interpolate(frame, [CLICK_BTN - 3, CLICK_BTN + 2, CLICK_BTN + 10], [0, 1, 0], clamp);
  const scanY = interpolate(frame, [S3 + 5, S4 - 15], [430, 700], { ...clamp, easing: Easing.inOut(Easing.ease) });
  const scanOn = interpolate(frame, [S3, S3 + 12, S4 - 22, S4 - 6], [0, 1, 1, 0], clamp);

  const worldOut = interpolate(frame, [S4 - 14, S4], [1, 0], clamp);
  const vinIn = interpolate(frame, [S5 - 12, S5 + 10], [0, 1], clamp);
  const vinOut = interpolate(frame, [S6 - 14, S6], [1, 0], clamp);
  const vinScroll = interpolate(frame, [S5 + 10, S6 - 10], [40, 860], { ...clamp, easing: ease });
  const cardOut = interpolate(frame, [S5 - 14, S5], [1, 0], clamp);

  const logo = spring({ frame: frame - S6 - 4, fps, config: { damping: 14, mass: 0.8 } });
  const tag = interpolate(frame, [S6 + 20, S6 + 44], [0, 1], clamp);
  const cta = spring({ frame: frame - S6 - 34, fps, config: { damping: 13, mass: 0.7 } });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 0%, #FBF6EE 0%, ${T.paper} 45%, #EFE4D4 100%)`, overflow: "hidden" }}>
      {/* ---------- audio ---------- */}
      {/* Original 126bpm instrumental. Its drop is written to land on S4, so the
          arrangement opens up on the same frame the deal card arrives. */}
      <Audio
        src={staticFile("remotion/sfx/music.wav")}
        volume={(f) => MIX * interpolate(f, [0, 40, S4 - 10, S4 + 20, S6, S6 + 40], [0, 0.24, 0.24, 0.33, 0.33, 0.26], clamp)}
      />
      <Sequence from={0} durationInFrames={40}><Audio src={staticFile("remotion/sfx/whoosh.wav")} volume={0.3 * MIX} /></Sequence>
      <Sequence from={CLICK_INPUT} durationInFrames={12}><Audio src={staticFile("remotion/sfx/click.wav")} volume={0.4 * MIX} /></Sequence>
      <Sequence from={TYPE_START} durationInFrames={130}><Audio src={staticFile("remotion/sfx/typing.wav")} volume={0.28 * MIX} /></Sequence>
      <Sequence from={CLICK_BTN} durationInFrames={12}><Audio src={staticFile("remotion/sfx/click.wav")} volume={0.44 * MIX} /></Sequence>
      <Sequence from={505} durationInFrames={66}><Audio src={staticFile("remotion/sfx/riser.wav")} volume={0.28 * MIX} /></Sequence>
      <Sequence from={S4} durationInFrames={40}><Audio src={staticFile("remotion/sfx/whoosh.wav")} volume={0.36 * MIX} /></Sequence>
      <Sequence from={S4} durationInFrames={34}><Audio src={staticFile("remotion/sfx/thump.wav")} volume={0.42 * MIX} /></Sequence>
      {[...CHIP_F, ...FLAG_F].map((f) => (
        <Sequence key={f} from={f} durationInFrames={12}><Audio src={staticFile("remotion/sfx/pop.wav")} volume={0.24 * MIX} /></Sequence>
      ))}
      <Sequence from={RING_B} durationInFrames={100}><Audio src={staticFile("remotion/sfx/ding.wav")} volume={0.36 * MIX} /></Sequence>
      <Sequence from={S5} durationInFrames={40}><Audio src={staticFile("remotion/sfx/whoosh.wav")} volume={0.3 * MIX} /></Sequence>
      <Sequence from={S6} durationInFrames={40}><Audio src={staticFile("remotion/sfx/whoosh.wav")} volume={0.26 * MIX} /></Sequence>
      <Sequence from={S6} durationInFrames={30}><Audio src={staticFile("remotion/sfx/thump.wav")} volume={0.28 * MIX} /></Sequence>
      <Sequence from={S6 + 6} durationInFrames={110}><Audio src={staticFile("remotion/sfx/ding.wav")} volume={0.3 * MIX} /></Sequence>

      {/* ---------- scenes 1-3: the real page, flown through ---------- */}
      {frame < S4 && (
        <AbsoluteFill style={{ opacity: worldOut }}>
          <div style={cam}>
            <div style={{ position: "relative", width: W, filter: "drop-shadow(0 30px 70px rgba(80,55,30,.22))" }}>
              <Chrome />
              <div style={{ position: "relative", width: W, overflow: "hidden", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                <Img src={staticFile("remotion/demo/home-empty.png")} style={{ width: W, display: "block" }} />

                {/* focus ring + typed text drawn into the real input */}
                <div
                  style={{
                    position: "absolute",
                    left: INPUT.x - 10,
                    top: INPUT.y - 4,
                    width: INPUT.w + 20,
                    height: INPUT.h + 8,
                    border: `2px solid ${T.orange}`,
                    borderRadius: 10,
                    opacity: focus * 0.9,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: INPUT.x,
                    top: INPUT.y,
                    width: INPUT.w,
                    height: INPUT.h,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    overflow: "hidden",
                    fontFamily: FONT,
                    fontSize: 16,
                    color: T.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{TYPED.slice(0, nChars)}</span>
                  <span style={{ display: "inline-block", width: 1.5, height: 20, background: T.ink, marginLeft: 1, opacity: caret && focus > 0.5 ? 1 : 0 }} />
                </div>

                {/* button press highlight */}
                <div
                  style={{
                    position: "absolute",
                    left: BUTTON.x,
                    top: BUTTON.y,
                    width: BUTTON.w,
                    height: BUTTON.h,
                    borderRadius: 99,
                    background: "#000",
                    opacity: btnPress * 0.16,
                  }}
                />

                {/* analysing sweep across the hero */}
                {scanOn > 0 && (
                  <>
                    <div style={{ position: "absolute", left: 360, right: 360, top: scanY, height: 3, background: `linear-gradient(90deg, transparent, ${T.orange}, transparent)`, opacity: scanOn }} />
                    <div style={{ position: "absolute", left: 360, right: 360, top: scanY - 90, height: 90, background: `linear-gradient(180deg, transparent, rgba(180,80,31,.09))`, opacity: scanOn }} />
                  </>
                )}

                <Ripple x={INPUT.x + 96} y={INPUT.y + 25} t={interpolate(frame, [CLICK_INPUT, CLICK_INPUT + 26], [0, 1], clamp)} />
                <Ripple x={BUTTON.x + BUTTON.w / 2} y={BUTTON.y + 25} t={interpolate(frame, [CLICK_BTN, CLICK_BTN + 26], [0, 1], clamp)} />
                {frame >= S2 && frame < S3 + 30 && <Cursor x={cx} y={cy} press={press} />}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- scene 4: animated deal card ---------- */}
      {frame >= S4 - 6 && frame < S5 + 6 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: cardOut }}>
          <DealCard />
        </AbsoluteFill>
      )}

      {/* ---------- scene 5: real VIN report, scrolling ---------- */}
      {frame >= S5 - 14 && frame < S6 + 6 && (
        <AbsoluteFill style={{ opacity: vinIn * vinOut, alignItems: "center" }}>
          <div style={{ width: W, height: H, overflow: "hidden" }}>
            <Img src={staticFile("remotion/demo/vin-report.png")} style={{ width: W, display: "block", transform: `translateY(${-vinScroll}px)` }} />
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- scene 6: end card ---------- */}
      {frame >= S6 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 70 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 128, color: T.ink, letterSpacing: -4, transform: `scale(${0.86 + logo * 0.14})`, opacity: logo }}>
              Deal<span style={{ color: T.orange }}>Scan</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 42, color: T.muted, marginTop: 16, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)` }}>
              Score any car listing in seconds.
            </div>
            <div style={{ marginTop: 40, display: "inline-block", background: T.orange, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 36, padding: "20px 48px", borderRadius: 999, transform: `scale(${0.86 + cta * 0.14})`, opacity: cta, boxShadow: "0 18px 44px rgba(180,80,31,.32)" }}>
              dealscan.dev · Free · No signup
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ---------- captions ---------- */}
      <Caption text="Found a car online?" start={18} end={140} />
      <Caption text="Paste the listing link" start={165} end={438} />
      <Caption text="DealScan reads the listing" start={S3 + 8} end={S4 - 8} />
      <Caption text="0-100 deal score. Every red flag." start={S4 + 14} end={S5 - 12} />
      <Caption text="Plus a free VIN report" start={S5 + 12} end={S6 - 12} />

      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(75% 62% at 50% 46%, rgba(0,0,0,0) 55%, rgba(60,40,20,.16) 100%)", pointerEvents: "none", zIndex: 80 }} />
    </AbsoluteFill>
  );
};
