import {atom} from 'jotai';
import {atomWithReset} from 'jotai/utils';

export const supernovaStateAtom = atomWithReset({
  toggleLasso: () => {},
  confirmSelection: () => {},
  cancelSelection: () => {},
  clear: () => {},
  element: undefined,
  position: undefined,
  id: undefined,
  active: false,
});

export const supernovaToolTipStateAtom = atomWithReset({
  config: undefined,
});

export const supernovaToolTipVisible = atom(false);
