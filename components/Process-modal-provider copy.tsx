"use client";

import { useEffect, useState } from "react";
import { ProModal } from "./pro-modal";
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
