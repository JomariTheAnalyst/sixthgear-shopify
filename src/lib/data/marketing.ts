// Marketing data — returns empty until CMS integration is added
export const getMarketingForPath = async (_path?: string) =>
  ({ strip: null, banners: [], popups: [] }) as { strip: any; banners: any[]; popups: any[] }
