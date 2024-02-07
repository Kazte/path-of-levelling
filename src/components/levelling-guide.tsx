import { IGuide } from '@/interfaces/guide.interface';
import { cn } from '@/lib/utils';
import { useGuideStore } from '@/store/guide.store';

interface Props {
  levellingGuide: IGuide;
}

export default function LevellingGuide({ levellingGuide }: Props) {
  const { currentStep, setCurrentStep } = useGuideStore((state) => state);

  const handleOnClick = (index: number) => {
    console.log('index', index);
    setCurrentStep(index);
  };

  return (
    <div>
      {levellingGuide.map((step, i) => (
        <div
          key={i}
          className={cn(
            i < levellingGuide.length - 1 ? 'border-b-[1px]' : '',
            currentStep === i && 'bg-neutral-700',
            'py-2'
          )}
        >
          {step.subSteps.map((subStep, j) => (
            <div
              key={j}
              onClick={() => {
                handleOnClick(i);
              }}
            >
              <p>{subStep.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
