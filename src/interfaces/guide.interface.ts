export type IGuide = ISection[];

export interface ISection {
  name: string;
  steps: IStep[];
}

export interface IStep {
  type: string;
  parts: any[];
}
