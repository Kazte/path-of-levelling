import { IGuide, IStep, ISubstep } from '@/interfaces/guide.interface';
import {
  IGuideImport,
  IStepImport
} from '../interfaces/guide-import.interface';

import { Gem } from '@/interfaces/types';
import { areas } from '@/data/level-tracker-areas';
import { gems } from '@/data/level-tracker-gems';
import { quests } from '@/data/level-tracker-quests';
import { useGuideStore } from '@/store/guide.store';

export function sanitizeGuide(rawGuide: IGuideImport): IGuide {
  const flatGuide: IStepImport[] = [...rawGuide]
    .map((section) => section.steps)
    .flat();

  let guide: IGuide = [];

  const sanitizedStep: IStep[] = [];
  let sanitizedSubsteps: ISubstep[] = [];
  for (const step of flatGuide) {
    // Sanitize Steps (Separate steps into area changes)

    let sanitizedSubstepDescription = '';
    let isEnterStep = false;
    let changeAreaId = '';

    if (step.type === 'fragment_step') {
      step.parts.forEach((part: any) => {
        // Sanitize Parts (Each part of a step)
        if (typeof part === 'object') {
          switch (part.type) {
            case 'enter':
              // @ts-ignore
              const area = areas[part.areaId];
              sanitizedSubstepDescription += area.name;

              isEnterStep = true;
              changeAreaId = part.areaId;

              break;
            case 'kill':
              sanitizedSubstepDescription += part.value;
              break;
            case 'arena':
              sanitizedSubstepDescription += part.value;
              break;
            case 'area':
              // @ts-ignore
              sanitizedSubstepDescription += areas[part.areaId].name;
              break;
            case 'quest':
              const quest = part.questId;

              // @ts-ignore
              const rewardOffers = quests[quest].reward_offers[quest];

              if (rewardOffers) {
                sanitizedSubstepDescription += `${rewardOffers.quest_npc}.`;
              } else {
                // @ts-ignore
                sanitizedSubstepDescription = `Complete ${quests[quest].name}`;
              }
              break;
            case 'waypoint_use':
              // @ts-ignore
              const dstArea = areas[part.dstAreaId].name;
              // @ts-ignore
              const srcArea = areas[part.srcAreaId].name;
              // sanitizedSubstepDescription += `Use waypoint from ${srcArea} to ${dstArea}.`;
              sanitizedSubstepDescription += `Use waypoint to ${dstArea}.`;
              isEnterStep = true;
              changeAreaId = part.dstAreaId;
              break;
            case 'portal_set':
              // @ts-ignore
              sanitizedSubstepDescription += 'portal';
              break;
            case 'portal_use':
              // @ts-ignore
              const dstAreaPortal = areas[part.dstAreaId].name;
              sanitizedSubstepDescription += `portal to ${dstAreaPortal}.`;
              isEnterStep = true;
              changeAreaId = part.dstAreaId;
              break;
            case 'waypoint_get':
              sanitizedSubstepDescription += `waypoint`;
              break;
            case 'logout':
              sanitizedSubstepDescription += 'Logout.';
              isEnterStep = true;
              changeAreaId = part.areaId;
              break;
            case 'trial':
              sanitizedSubstepDescription += 'Trial';
              break;
            case 'crafting':
              sanitizedSubstepDescription += 'crafting';
              break;
            case 'ascend':
              // @ts-ignore
              const labName = labNames[part.version];
              sanitizedSubstepDescription += `Complete the ${labName} Lab.`;
              break;
            case 'waypoint':
              sanitizedSubstepDescription += 'waypoint';
              break;
            case 'generic':
              sanitizedSubstepDescription += part.value;
              break;
            case 'dir':
              sanitizedSubstepDescription += dirIndex[part.dirIndex];
              break;
            default:
              sanitizedSubstepDescription +=
                part.value || 'PART NOT FOUND: ' + part.type;
              break;
          }
        } else {
          sanitizedSubstepDescription += part;
        }
      });
    } else if (step.type === 'gem_step') {
      // @ts-ignore
      const gemId = step.requiredGem.id;
      const gem = gems.find((g: Gem) => g.id === gemId) as Gem;

      if (gem) {
        sanitizedSubstepDescription += `Get gem ${gem.name}`;
      } else {
        const gemNameRaw = gemId.split('/')[gemId.split('/').length - 1];
        sanitizedSubstepDescription += `Get gem ${gemNameRaw}`;
      }

      // const gem = gems.find((g) => g.id === gemId);

      // sanitizedSubstepDescription += `Get gem ${gem}`;
    }

    sanitizedSubsteps.push({
      description: sanitizedSubstepDescription
    });

    // console.log('Sanitized Substeps: ', sanitizedSubsteps);

    if (isEnterStep) {
      sanitizedStep.push({
        subSteps: sanitizedSubsteps,
        changeAreaId
      });

      sanitizedSubsteps = [];
    }
  }

  guide = sanitizedStep;

  // console.log('Sanitized Guide: ', guide);

  return guide;
}

export function setNewGuide(guideText: string) {
  if (!guideText) return;

  try {
    const guideData = JSON.parse(guideText);
    // const validate = avj.compile(guideSchema);
    // if (!validate(guideData)) {
    //   throw new Error('Invalid guide data');
    // }
    useGuideStore.setState({
      guide: sanitizeGuide(guideData as IGuideImport),
      currentStep: 0
    });
    // saveLocalStorage('guide', guideText);
  } catch (e) {
    console.error('Error setting new guide: \n', e);
  }
}

export function clearGuide() {
  useGuideStore.setState({ guide: null, currentStep: 0 });
  // removeLocalStorage('guide');
}

const dirIndex: string[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W'];

const labNames = {
  normal: 'Normal',
  cruel: 'Cruel',
  merciless: 'Merciless',
  eternal: 'Eternal'
};
