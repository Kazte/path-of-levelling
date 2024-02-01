import { IGuide, ISection, IStep } from '../interfaces/guide.interface';
import StepGuide from './step-guide';

interface Props {
  levellingGuide: IGuide;
}

export default function LevellingGuide({ levellingGuide }: Props) {
  return (
    <div>
      {levellingGuide.map((section: ISection, index) => {
        return (
          <details
            key={index}
            className='border-b-[1px] bg-neutral-950 border-neutral-700 cursor-pointer sticky top-8 '
          >
            <summary className='bg-neutral-900 list-none hover:bg-red-40 select-none h-8 z-1'>
              <h3>{section.name}</h3>
            </summary>
            <>
              {section.steps.map((step: IStep, index) => (
                <StepGuide key={index} step={step} />
              ))}
            </>
          </details>
        );
      })}
    </div>
  );
}
