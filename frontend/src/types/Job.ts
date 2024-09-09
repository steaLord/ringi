import { IApplication } from "./Application";

export interface IJob {
  id: number;
  title: string;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  applications?: IApplication[];
}
