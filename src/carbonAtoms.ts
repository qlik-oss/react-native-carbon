import {atom} from 'jotai';
import {atomWithReset} from 'jotai/utils';

export type SupernovaStateAtom = {
  toggleLasso: (toggled: boolean) => void;
  confirmSelection: () => void;
  cancelSelection: () => void;
  clear: () => void;
  id?: string;
  active: boolean;
};

export const supernovaStateAtom = atomWithReset<SupernovaStateAtom>({
  toggleLasso: () => {},
  confirmSelection: () => {},
  cancelSelection: () => {},
  clear: () => {},
  id: undefined,
  active: false,
});

export const supernovaToolTipStateAtom = atomWithReset({
  config: undefined,
});

export const supernovaToolTipVisible = atom(false);
