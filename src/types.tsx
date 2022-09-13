export interface Conditions {
  mountain: number;
  valley: number;
  new_snow: number;
  open_lifts: number;
  time: string;
  time_updated: string;
}

export interface SkiResort {
  _id: string;
  name: string;
  country: string;
  conditions: Conditions[];
}