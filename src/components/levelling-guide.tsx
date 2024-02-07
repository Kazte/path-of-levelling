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
      {levellingGuide.map((step, index) => (
        <div
          key={index}
          className={cn(
            index < levellingGuide.length - 1 ? 'border-b-[1px]' : '',
            currentStep === index && 'bg-neutral-700',
            'py-2'
          )}
        >
          {step.subSteps.map((subStep, index) => (
            <div key={index}>
              <p>{subStep.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
