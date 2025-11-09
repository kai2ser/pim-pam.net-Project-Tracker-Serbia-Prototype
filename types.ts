export type LocationType = 'Point' | 'LineString' | 'Polygon';

export interface ProjectLocation {
  type: LocationType;
  // For Point: [lat, lng]
  // For LineString: [[lat, lng], [lat, lng], ...]
  // For Polygon: [[[lat, lng], [lat, lng], ...]]
  coordinates: any; 
}

export interface Project {
  id: number;
  projectCode: string;
  name: string; // Serbian name
  name_en: string; // English name
  totalCostRSD: number;
  totalCostEUR: number;
  disbursed2024: number;
  plan2025: number;
  plan2026: number;
  plan2027: number;
  plan2028: number;
  plan2029_beyond: number;
  location: ProjectLocation | null;
}