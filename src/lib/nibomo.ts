export const buildNibomoUrl = (campaign: string, content: string): string => {
  const url = new URL('https://nibomo.com/');
  url.search = new URLSearchParams({
    utm_source: 'kirill-markin.com',
    utm_medium: 'referral',
    utm_campaign: campaign,
    utm_content: content
  }).toString();
  return url.toString();
};
