// Наповнення всіх <select> перекладеними опціями. Кличеться на старті й при зміні мови.
import { t } from './i18n.js';
import { fillSel } from './ui.js';

export function buildSelects() {
  fillSel('f-meal', [{ v: 'breakfast', l: t('mB') }, { v: 'lunch', l: t('mL') }, { v: 'dinner', l: t('mD') }, { v: 'snack', l: t('mS') }, { v: 'extra', l: t('mE') }]);
  fillSel('w-type', [{ v: 'cardio', l: t('wC') }, { v: 'strength', l: t('wS') }, { v: 'flexibility', l: t('wF') }, { v: 'sports', l: t('wSp') }, { v: 'hiit', l: t('wH') }, { v: 'other', l: t('wO') }]);
  fillSel('w-int', [{ v: 'low', l: t('iL') }, { v: 'medium', l: t('iM') }, { v: 'high', l: t('iH') }]);
  fillSel('s-type', [{ v: 'vitamin', l: t('svV') }, { v: 'protein', l: t('svP') }, { v: 'mineral', l: t('svM') }, { v: 'amino', l: t('svA') }, { v: 'other', l: t('svO') }]);
  fillSel('s-time', [{ v: 'morning', l: t('swM') }, { v: 'noon', l: t('swN') }, { v: 'evening', l: t('swE') }, { v: 'bed', l: t('swB') }, { v: 'pre', l: t('swPre') }, { v: 'post', l: t('swPost') }]);
  const acts = [{ v: 'sedentary', l: t('aSed') }, { v: 'desk', l: t('aDesk') }, { v: 'light', l: t('aLight') }, { v: 'moderate', l: t('aMod') }, { v: 'active', l: t('aActive') }, { v: 'very', l: t('aVery') }, { v: 'athlete', l: t('aAth') }, { v: 'manual', l: t('aManual') }];
  const goals = [{ v: 'lose', l: t('gLose') }, { v: 'maintain', l: t('gMaintain') }, { v: 'gain', l: t('gGain') }, { v: 'health', l: t('gHealth') }, { v: 'recomp', l: t('gRecomp') }];
  fillSel('p-act', acts);
  fillSel('p-goal', goals);
  fillSel('p-body', [{ v: 'ectomorph', l: t('bEcto') }, { v: 'mesomorph', l: t('bMeso') }, { v: 'endomorph', l: t('bEndo') }, { v: 'lean', l: t('bLean') }, { v: 'athletic', l: t('bAth') }, { v: 'average', l: t('bAvg') }, { v: 'overweight', l: t('bOver') }, { v: 'underweight', l: t('bUnder') }]);
  fillSel('c-act', acts);
  fillSel('c-goal', goals);
}
