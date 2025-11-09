import { Project, ProjectLocation } from '../types';
import { projectTable } from './database';

const EUR_RSD_RATE = 117.2;

// Locations are maintained separately as they are not part of the core financial data sheet.
const oldLocations = new Map<number, ProjectLocation | null>([
  [1, { "type": "LineString", "coordinates": [[44.75, 20.4], [44.82, 20.48]] }],
  [2, { "type": "LineString", "coordinates": [[44.8, 20.45], [43.32, 21.9]] }],
  [3, { "type": "LineString", "coordinates": [[43.32, 21.9], [43.15, 22.7]] }],
  [4, { "type": "LineString", "coordinates": [[44.8, 20.45], [45.25, 19.83], [46.1, 19.66]] }],
  [5, { "type": "LineString", "coordinates": [[45.25, 19.83], [45.1, 19.82]] }],
  [6, { "type": "LineString", "coordinates": [[43.7, 21.5], [43.88, 20.35]] }],
  [7, { "type": "LineString", "coordinates": [[43.88, 20.35], [43.84, 20.03]] }],
  [8, { "type": "LineString", "coordinates": [[45.1, 19.82], [44.75, 19.69], [44.53, 19.22]] }],
  [9, { "type": "LineString", "coordinates": [[43.32, 21.9], [43.1, 21.5]] }],
  [10, { "type": "LineString", "coordinates": [[44.9, 19.25], [44.95, 19.45]] }],
  [11, { "type": "LineString", "coordinates": [[44.6, 21.18], [44.65, 21.63]] }],
  [12, { "type": "LineString", "coordinates": [[44.0, 20.9], [44.05, 20.95]] }],
  [13, { "type": "LineString", "coordinates": [[45.77, 19.11], [45.83, 20.47]] }],
  [14, { "type": "LineString", "coordinates": [[44.6, 21.18], [44.65, 21.63]] }],
  [15, null],
  [16, { "type": "LineString", "coordinates": [[44.8, 20.45], [45.25, 20.38], [45.25, 19.83]] }],
  [17, { "type": "Point", "coordinates": [44.808, 20.444] }],
  [18, { "type": "LineString", "coordinates": [[44.8, 20.3], [44.82, 20.4]] }],
  [19, { "type": "LineString", "coordinates": [[44.73, 20.53], [44.88, 20.64]] }],
  [20, { "type": "Point", "coordinates": [45.25, 19.4] }],
  [21, { "type": "Point", "coordinates": [43.9, 20.18] }],
  [22, { "type": "Point", "coordinates": [43.33, 21.85] }],
  [23, { "type": "LineString", "coordinates": [[43.32, 21.9], [43.15, 22.7]] }],
  [24, { "type": "LineString", "coordinates": [[43.32, 21.9], [42.3, 21.7]] }],
  [25, { "type": "Point", "coordinates": [43.4, 19.6] }],
  [26, { "type": "Point", "coordinates": [44.83, 20.55] }],
  [27, null],
  [28, null],
  [29, null],
  [30, null],
  [31, { "type": "Point", "coordinates": [44.8, 20.46] }],
  [32, { "type": "Point", "coordinates": [45.24, 19.83] }],
  [33, { "type": "Point", "coordinates": [44.0, 20.91] }],
  [34, { "type": "Point", "coordinates": [44.79, 20.45] }],
  [35, { "type": "Point", "coordinates": [44.77, 20.47] }],
  [36, null],
  [37, null],
  [38, null],
  [39, { "type": "Point", "coordinates": [44.81, 20.4] }],
  [40, { "type": "Point", "coordinates": [44.8, 20.41] }],
  [41, { "type": "Point", "coordinates": [44.76, 20.42] }],
  [42, { "type": "Point", "coordinates": [44.78, 20.35] }],
  [43, { "type": "Point", "coordinates": [44.79, 20.36] }],
  [44, { "type": "Point", "coordinates": [44.80, 20.43] }],
  [45, null],
  [46, { "type": "Point", "coordinates": [45.25, 19.84] }],
  [47, null],
  [48, null],
  [49, null],
  [50, null],
  [51, { "type": "Point", "coordinates": [44.67, 22.53] }],
  [52, { "type": "Point", "coordinates": [44.28, 22.55] }],
  [53, { "type": "Point", "coordinates": [45.23, 19.86] }],
  [54, { "type": "Point", "coordinates": [45.25, 19.85] }],
  [55, { "type": "Point", "coordinates": [43.9, 22.28] }],
  [56, { "type": "Point", "coordinates": [43.0, 21.95] }]
]);

/**
 * Processes the raw project data from the "database" into the application's data model.
 * This includes:
 * - Mapping database columns to the Project type properties.
 * - Calculating EUR values from RSD.
 * - Attaching geographical location data.
 */
export const projects: Project[] = projectTable.map(row => {
    const totalCostRSD = row.total_value_rsd;
    const disbursed2024 = row.cost_up_to_2025;
    const plan2025 = row.proj_cost_2025;
    const plan2026 = row.proj_cost_2026;
    const plan2027 = row.proj_cost_2027;
    const plan2028 = row.proj_cost_2028;

    const plan2029_beyond = Math.max(0, 
        totalCostRSD - 
        disbursed2024 - 
        plan2025 - 
        plan2026 - 
        plan2027 - 
        plan2028
    );

    return {
        id: row.no,
        projectCode: row.project_code,
        name: row.project_name_srb,
        name_en: row.project_name_eng,
        totalCostRSD,
        totalCostEUR: Math.round(totalCostRSD / EUR_RSD_RATE),
        disbursed2024,
        plan2025,
        plan2026,
        plan2027,
        plan2028,
        plan2029_beyond,
        location: oldLocations.get(row.no) || null,
    };
});