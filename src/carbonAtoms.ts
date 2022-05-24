import {atom} from 'jotai';
import {atomWithReset} from 'jotai/utils';

export type SupernovaStateAtom = {
  confirmSelection: () => void;
  cancelSelection: () => void;
  clear: () => void;
  position: any;
  id?: string;
  active: boolean;
};

export const supernovaStateAtom = atomWithReset<SupernovaStateAtom>({
  confirmSelection: () => {},
  cancelSelection: () => {},
  clear: () => {},
  id: undefined,
  active: false,
  position: undefined,
});

export const supernovaToolTipStateAtom = atomWithReset({
  config: undefined,
});

export const supernovaToolTipVisible = atom(false);
