export type IGuide = IStep[];

// export interface ISection {
//   name: string;
//   steps: IStep[];
// }

export interface IStep {
  subSteps: ISubstep[];
  changeAreaId: string;
}

export interface ISubstep {
  description: string;
}
