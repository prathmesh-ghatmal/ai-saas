"use client";

import { useEffect, useState } from "react";
import { ProcessingModal } from "./processing-modal";

export const ProcessModalProvider = () => {
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <ProcessingModal />;
};
