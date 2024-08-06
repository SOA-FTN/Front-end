export interface Encounter {
  ID: string;
  name: string;
  description: string;
  xp_points: number;
  status: string;
  type: string;
  latitude: string;
  longitude: string;
  should_be_approved: boolean;
}
