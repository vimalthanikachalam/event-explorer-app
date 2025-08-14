export type EventItem = {
  id: string;
  name: string;
  url?: string;
  image?: string;
  date?: string; // ISO
  venue?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};

export type EventSearchParams = {
  keyword?: string;
  city?: string;
  page?: number;
  size?: number;
};
