"use client";

import { createContext, useContext, useMemo, useState } from "react";
import DialogLogin from "@/components/dialog/dialog-login";

type LoginContextValue = {
  openLogin: () => void;
  closeLogin: () => void;
  setOpen: (open: boolean) => void;
  isOpen: boolean;
};

const LoginContext = createContext<LoginContextValue | null>(null);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      setOpen: setIsOpen,
      openLogin: () => setIsOpen(true),
      closeLogin: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return (
    <LoginContext.Provider value={value}>
      {children}
      <DialogLogin open={isOpen} onOpenChange={setIsOpen} />
    </LoginContext.Provider>
  );
}

export function useLogin() {
  const ctx = useContext(LoginContext);
  if (!ctx) throw new Error("useLogin must be used within LoginProvider");
  return ctx;
}
