import {atom} from 'jotai';
import {atomWithReset} from 'jotai/utils';

export type SupernovaStateAtom = {
  confirmSelection: () => void;
  cancelSelection: () => void;
  toggleLasso: (val: boolean) => void;
  clear: () => void;
  position: any;
  id?: string;
  active: boolean;
  element: any;
  disableLasso: boolean;
};

export const supernovaStateAtom = atomWithReset<SupernovaStateAtom>({
  confirmSelection: () => {},
  cancelSelection: () => {},
  clear: () => {},
  toggleLasso: (_val: boolean) => {},
  id: undefined,
  active: false,
  position: undefined,
  element: null,
  disableLasso: false,
});

export const writeOnlySupernovaStateAtom = atom(null, (get, set, value: SupernovaStateAtom) => {
  set(supernovaStateAtom, value);
});

export const supernovaToolTipStateAtom = atomWithReset({
  config: undefined,
});

export const supernovaToolTipVisible = atomWithReset(false);
