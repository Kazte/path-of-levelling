import { IStep } from '../interfaces/guide.interface';

export default function StepGuide({ step }: { step: IStep }) {
  return (
    <div>
      <h4>{step.type}</h4>
      <p>{JSON.stringify(step.parts)}</p>
      <p>{JSON.stringify(step.subSteps)}</p>
    </div>
  );
}
