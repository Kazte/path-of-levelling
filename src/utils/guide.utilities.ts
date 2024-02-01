import { IGuide, IStep, ISection } from '../interfaces/guide.interface';

export function sanitizeGuide(guide: IGuide): string {
  let sanitizedSections = [];

  for (let section of guide) {
    let sanitizedSteps = [];
    for (const step of section.steps) {
      let sanitizedParts: any[] = [];
      let isEnter = false;

      for (const part of step.parts) {
        if (part.type === 'enter') {
          isEnter = true;
          break;
        }
      }

      sanitizedSteps.push(sanitizedParts);
    }
    sanitizedSections.push(sanitizedSteps);
  }

  console.log('Sanitized steps: ', sanitizedSections);
}
