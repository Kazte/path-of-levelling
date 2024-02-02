import { IStepImport } from '../interfaces/guide-import.interface';

export default function StepGuide({ step }: { step: IStepImport }) {
  return (
    <div>
      <h4>{step.type}</h4>
      <p>{JSON.stringify(step.parts)}</p>
      <p>{JSON.stringify(step.subSteps)}</p>
    </div>
  );
}
