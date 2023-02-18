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

export type SupernovaToolTipAtom = {
  data: Array<any>;
  x: number;
  y: number;
  layout?: any;
  visible: boolean;
};

export const writeOnlySupernovaStateAtom = atom(
  null,
  (get, set, value: SupernovaStateAtom) => {
    set(supernovaStateAtom, value);
  },
);

export const supernovaToolTipAtom = atom<SupernovaToolTipAtom | undefined>(
  undefined,
);

export const writeOnlySupernovaToolTipAtom = atom(
  null,
  (_get, set, value: SupernovaToolTipAtom) => {
    set(supernovaToolTipAtom, value);
  },
);
