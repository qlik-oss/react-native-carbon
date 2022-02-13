import {atom} from 'jotai';
import {atomWithReset} from 'jotai/utils';
import type Element from './components/Element';

export type SupernovaStateAtom = {
  toggleLasso: (toggled: boolean) => void;
  confirmSelection: () => void;
  cancelSelection: () => void;
  clear: () => void;
  element?: Element;
  position: any;
  id?: string;
  active: boolean;
  disableLasso: boolean;
};

export const supernovaStateAtom = atomWithReset<SupernovaStateAtom>({
  toggleLasso: () => {},
  confirmSelection: () => {},
  cancelSelection: () => {},
  clear: () => {},
  element: undefined,
  position: undefined,
  id: undefined,
  active: false,
  disableLasso: false,
});

export const supernovaToolTipStateAtom = atomWithReset({
  config: undefined,
});

export const supernovaToolTipVisible = atom(false);
