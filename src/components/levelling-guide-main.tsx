import { Button } from './ui/button';
import { IGuide } from '@/interfaces/guide.interface';
import { cn } from '@/lib/utils';
import { useGuideStore } from '@/store/guide.store';

interface Props {
  levellingGuide: IGuide;
}

export default function LevellingGuideMain({ levellingGuide }: Props) {
  const { currentStep, setCurrentStep } = useGuideStore((state) => state);

  const handleSetCurrentStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div>
      {levellingGuide.map((step, i) => (
        <div
          key={i}
          id={`step-${i}`}
          className={cn(
            i < levellingGuide.length - 1 ? 'border-b-[1px]' : '',
            currentStep === i && 'bg-neutral-700',
            'p-1 relative'
          )}
        >
          <Button
            className='absolute top-1 right-1 px-2 py-1 z-50'
            onClick={() => handleSetCurrentStep(i)}
            variant='link'
          >
            Change Step
          </Button>
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
