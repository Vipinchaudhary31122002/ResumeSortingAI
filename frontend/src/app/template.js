'use client';
import StoreProvider from "./StoreProvider";

export default function Template({ children }) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  );
}
