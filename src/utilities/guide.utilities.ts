import { IAreaData, areas } from '@/data/level-tracker-areas';
import {
  IGuideImport,
  IStepImport,
  ISectionImport
} from '../interfaces/guide-import.interface';
import Ajv from 'ajv';
import { guideSchema } from './guide.schema';
import { useGuideStore } from '@/store/guide.store';
import { removeLocalStorage, saveLocalStorage } from './save-localstorage';
import { IGuide, ISection, ISubstep } from '@/interfaces/guide.interface';

const avj = new Ajv();

export function sanitizeGuide(rawGuide: IGuideImport): IGuide {
  let guide: IGuide = [];

  for (const section of rawGuide) {
    const s: ISection = {
      name: section.name,
      steps: []
    };

    console.log('Sanitizing section: ', section.name);

    let subSteps: ISubstep[] = [];
    section.steps.forEach((step: IStepImport) => {
      let sanitizedStep = '';
      let isEnterStep = false;
      let changeAreaId = '';

      step.parts.forEach((part: any) => {
        if (typeof part === 'object') {
          switch (part.type) {
            case 'enter':
              // @ts-ignore
              const area = areas[part.areaId];
              sanitizedStep += area.name;

              isEnterStep = true;
              changeAreaId = part.areaId;

              break;
            case 'kill':
              sanitizedStep += part.value;
              break;
            case 'quest':
              sanitizedStep += part.questId + ' take rewards.';
              break;
            case 'waypoint_use':
              // @ts-ignore
              const dstArea = areas[part.dstAreaId].name;
              // @ts-ignore
              const srcArea = areas[part.srcAreaId].name;
              sanitizedStep += `Use waypoint from ${srcArea} to ${dstArea}.`;
              isEnterStep = true;
              changeAreaId = part.dstAreaId;
              break;
            case 'waypoint_get':
              sanitizedStep += `waypoint`;
              break;
            case 'logout':
              sanitizedStep += 'Logout.';
              isEnterStep = true;
              changeAreaId = part.areaId;
              break;
            default:
              sanitizedStep += part.value;
              break;
          }
        } else {
          sanitizedStep += part;
        }
      });

      subSteps.push({
        description: sanitizedStep
      });

      if (isEnterStep) {
        s.steps.push({
          subSteps: subSteps,
          changeAreaId: changeAreaId
        });
        subSteps = [];
        changeAreaId = '';
      }

      console.log('Sanitizing step: ', sanitizedStep);
    });

    guide.push(s);
  }

  console.log('Sanitized guide: ', guide);
  return guide;
}

export function setNewGuide(guideText: string) {
  if (!guideText) return;

  try {
    const guideData = JSON.parse(guideText);
    const validate = avj.compile(guideSchema);
    if (!validate(guideData)) {
      throw new Error('Invalid guide data');
    }
    useGuideStore.setState({ guide: sanitizeGuide(guideData as IGuideImport) });
    saveLocalStorage('guide', guideText);
  } catch (e) {
    console.error('Error setting new guide: \n', e);
  }
}

export function clearGuide() {
  useGuideStore.setState({ guide: null });
  removeLocalStorage('guide');
}
