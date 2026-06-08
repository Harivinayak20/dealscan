type AdSenseEnv = Record<string, string | undefined>;

export function normalizeAdSenseClientId(value?: string) {
  const trimmed = value?.trim() ?? "";

  return /^ca-pub-\d+$/.test(trimmed) ? trimmed : "";
}

export function getAdSenseSettings(env: AdSenseEnv = process.env) {
  return {
    enabled: env.NEXT_PUBLIC_ENABLE_ADSENSE === "true",
    clientId: normalizeAdSenseClientId(env.NEXT_PUBLIC_ADSENSE_CLIENT_ID),
    homeSlot: env.NEXT_PUBLIC_ADSENSE_HOME_SLOT?.trim() ?? "",
    inArticleSlot: env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT?.trim() ?? "",
  };
}

const adSenseSettings = getAdSenseSettings();

export const ADSENSE_ENABLED = adSenseSettings.enabled;
export const ADSENSE_CLIENT_ID = adSenseSettings.clientId;
export const ADSENSE_HOME_SLOT = adSenseSettings.homeSlot;
export const ADSENSE_IN_ARTICLE_SLOT = adSenseSettings.inArticleSlot;

export function isAdSenseReady(
  slot?: string,
  settings: Pick<ReturnType<typeof getAdSenseSettings>, "enabled" | "clientId"> = adSenseSettings,
) {
  return settings.enabled && Boolean(settings.clientId) && Boolean(slot?.trim());
}
