import { IGuide, ISection, IStep } from '@/interfaces/guide.interface';
import StepGuide from './step-guide';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './ui/accordion';

interface Props {
  levellingGuide: IGuide;
}

export default function LevellingGuide({ levellingGuide }: Props) {
  return (
    <div>
      {levellingGuide.map((section: ISection, index) => (
        <Accordion key={index} type='single' collapsible>
          <AccordionItem value='value-1'>
            <AccordionTrigger>{section.name}</AccordionTrigger>
            <AccordionContent>
              {section.steps.map((step: IStep, index) => (
                <div key={index} className='my-2 border-b-[1px] border-border'>
                  <StepGuide step={step} />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
