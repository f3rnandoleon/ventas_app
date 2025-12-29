import { create } from "zustand";

type NetworkStatus = "online" | "offline" | "syncing";

type NetworkState = {
  status: NetworkStatus;
  setStatus: (s: NetworkStatus) => void;
};

export const useNetworkStore = create<NetworkState>((set) => ({
  status: "online",
  setStatus: (status) => set({ status }),
}));
