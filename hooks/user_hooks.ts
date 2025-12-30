import { create } from "zustand"

export interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  hasDeletePermission: boolean;
}

interface UserModelProps {
  user: UserProps;
  setUser: (user: UserProps) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useUsers = create<UserModelProps>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  user: {
    id: "",
    name: "",
    email: "",
    role: "",
    emailVerified: false,
    hasDeletePermission: false,
  },
  setUser: (user: UserProps) => set({ user }),
}))