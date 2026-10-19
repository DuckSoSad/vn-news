import { create } from 'zustand';

interface PopupState {
  logoutOpen: boolean;
  setLogoutOpen: (logoutOpen: boolean) => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  logoutOpen: false,
  setLogoutOpen: (logoutOpen) => set({ logoutOpen }),
}));
