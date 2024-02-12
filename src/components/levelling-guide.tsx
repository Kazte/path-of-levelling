import { IGuide } from '@/interfaces/guide.interface';
import { cn } from '@/lib/utils';
import { useGuideStore } from '@/store/guide.store';

interface Props {
  levellingGuide: IGuide;
}

export default function LevellingGuide({ levellingGuide }: Props) {
  const { currentStep } = useGuideStore((state) => state);

  return (
    <div>
      {levellingGuide.map((step, i) => (
        <div
          key={i}
          id={`step-${i}`}
          className={cn(
            i < levellingGuide.length - 1 ? 'border-b-[1px]' : '',
            currentStep === i && 'bg-neutral-700',
            'p-1'
          )}
        >
          <p className='text-sm opacity-50 underline'>Step: {i + 1}</p>
          {step.subSteps.map((subStep, j) => (
            <div key={j}>
              <p>{subStep.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
