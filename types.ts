
export type LocationType = 'Point' | 'LineString' | 'Polygon';

export interface ProjectLocation {
  type: LocationType;
  // For Point: [lat, lng]
  // For LineString: [[lat, lng], [lat, lng], ...]
  // For Polygon: [[[lat, lng], [lat, lng], ...]]
  coordinates: any; 
}

export interface Project {
  id: string;
  name: string;
  totalCostRSD: number;
  totalCostEUR: number;
  disbursed2023: number;
  plan2024: number;
  plan2025: number;
  plan2026: number;
  plan2027_beyond: number;
  location: ProjectLocation | null;
}

export interface AISummary {
  locationSummary: string;
  pressReportsSummary:string;
}