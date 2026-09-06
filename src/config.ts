const PLAY_CAMPAIGNS = {
  website_launch: "referral",
  fishing_journal_app: "organic",
} as const;

export type PlayCampaign = keyof typeof PLAY_CAMPAIGNS;

export function getPlayUrl(campaign: PlayCampaign = "website_launch"): string {
  const url = new URL("https://play.google.com/store/apps/details");
  url.search = new URLSearchParams({
    id: "com.catchid.app",
    utm_source: "catchid_website",
    utm_medium: PLAY_CAMPAIGNS[campaign],
    utm_campaign: campaign,
  }).toString();
  return url.href;
}

export const PLAY_URL = getPlayUrl();
export const PRIVACY_URL = "https://petecolley.github.io/catchid-privacy/";
export const SUPPORT_URL = "mailto:colley.apps@gmail.com";
