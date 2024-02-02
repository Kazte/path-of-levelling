import { IStep } from '../interfaces/guide.interface';

export default function StepGuide({ step }: { step: IStep }) {
  return (
    <div>
      {step.subSteps.map((subStep, index) => (
        <div key={index}>
          <p>{subStep.description}</p>
        </div>
      ))}
    </div>
  );
}
