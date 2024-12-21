"use client";
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("37559c84-2935-4a77-9be6-284b6c5e6d22");
  }, []);
  return null;
};
