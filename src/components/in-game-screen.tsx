import { ISubstep } from '@/interfaces/guide.interface';
import { useGuideStore } from '@/store/guide.store';

export default function InGameScreen() {
  const { guide, currentStep } = useGuideStore((state) => state);

  return (
    <section className='w-full h-full text-center flex flex-row gap-2 justify-around items-center select-none overflow-hidden'>
      {guide !== null && currentStep !== null && (
        <div className='flex flex-col gap-1' id={`step-${currentStep}`}>
          <p className='text-sm opacity-50 underline absolute top-1 left-1'>
            Step: {currentStep + 1}
          </p>
          {guide[currentStep].subSteps.map(
            (subStep: ISubstep, index: number) => (
              <div key={index}>
                <p>{subStep.description}</p>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}
