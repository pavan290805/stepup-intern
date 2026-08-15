"use client";

type ToastInput = string | { message?: string };

function showToast(kind: "success" | "error" | "info", input: ToastInput) {
  const message = typeof input === "string" ? input : input.message ?? "";

  if (message) {
    console[kind === "error" ? "error" : "log"](`[toast:${kind}] ${message}`);
  }
}

export const toast = {
  success: (input: ToastInput) => showToast("success", input),
  error: (input: ToastInput) => showToast("error", input),
  info: (input: ToastInput) => showToast("info", input),
};

export type ToasterProps = {
  position?: string;
  richColors?: boolean;
  closeButton?: boolean;
};

export function Toaster(_props: ToasterProps) {
  return null;
}
