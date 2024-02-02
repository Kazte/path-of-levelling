import {
  IGuideImport,
  IStepImport,
  ISectionImport
} from '../interfaces/guide-import.interface';
import Ajv from 'ajv';
import { guideSchema } from './guide.schema';
import { useGuideStore } from '@/store/guide.store';
import { removeLocalStorage, saveLocalStorage } from './save-localstorage';

const avj = new Ajv();

export function sanitizeGuide(guide: IGuideImport): string {
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

export function setNewGuide(guideText: string) {
  console.log('Setting new guide: ', guideText);

  if (!guideText) return;

  try {
    const guideData = JSON.parse(guideText);
    const validate = avj.compile(guideSchema);
    if (!validate(guideData)) {
      throw new Error('Invalid guide data');
    }

    useGuideStore.setState({ guide: guideData as IGuideImport });
    saveLocalStorage('guide', guideText);
  } catch (e) {
    console.error('Error setting new guide: \n', e);
  }
}

export function clearGuide() {
  useGuideStore.setState({ guide: null });
  removeLocalStorage('guide');
}
