export type IGuideImport = ISectionImport[];

export interface ISectionImport {
  name: string;
  steps: IStepImport[];
}

export interface IStepImport {
  type: string;
  parts: any[];
  subSteps: ISubStepImport[];
}

export interface ISubStepImport {
  type: string;
  parts: any[];
  subSteps: any[];
}
