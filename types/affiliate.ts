export interface Affiliate {
  id: string;
  name: string;
  category: string;
  region?: string;
  address: string;
  image: string;
  latitude: number;
  longitude: number;
  subcategory?: string;
  sectionTitle?: string;
  description?: string;
  phone?: string;
  hours?: string;
  benefits?: string;
  isRealtime?: boolean;
}
