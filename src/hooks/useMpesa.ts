import { useCallback, useMemo, useState } from "react";

export type MpesaStkStatus = "idle" | "pending" | "success" | "failed";

export interface MpesaStkMeta {
  phoneNumber: string;
  amount: number;
  reference: string;
  initiatedAt: number;
}

export interface UseMpesaOptions {
  /**
   * Simulated delay for the STK push lifecycle in milliseconds.
   * Default: 3200ms
   */
  simulatedDelayMs?: number;
  /**
   * Probability between 0 and 1 that a transaction will fail.
   * Default: 0.1 (10% failure rate)
   */
  failureRate?: number;
}

export interface UseMpesaResult {
  status: MpesaStkStatus;
  meta: MpesaStkMeta | null;
  error: string | null;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isFailed: boolean;
  initiateStkPush: (params: { phoneNumber: string; amount: number }) => void;
  reset: () => void;
}

const defaultOptions: Required<UseMpesaOptions> = {
  simulatedDelayMs: 3200,
  failureRate: 0.1,
};

const sanitizePhoneNumber = (raw: string): string => {
  const digits = raw.replace(/[^\d]/g, "");

  if (!digits) return "";

  // Normalize common Kenyan M-Pesa formats to 2547XXXXXXXX
  if (digits.startsWith("0")) {
    return `254${digits.slice(1)}`;
  }

  if (digits.startsWith("7") || digits.startsWith("1")) {
    return `254${digits}`;
  }

  if (digits.startsWith("254")) {
    return digits;
  }

  return digits;
};

export const useMpesa = (options?: UseMpesaOptions): UseMpesaResult => {
  const { simulatedDelayMs, failureRate } = useMemo(
    () => ({ ...defaultOptions, ...options }),
    [options]
  );

  const [status, setStatus] = useState<MpesaStkStatus>("idle");
  const [meta, setMeta] = useState<MpesaStkMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initiateStkPush: UseMpesaResult["initiateStkPush"] = useCallback(
    ({ phoneNumber, amount }) => {
      const normalizedPhone = sanitizePhoneNumber(phoneNumber);

      if (!normalizedPhone || normalizedPhone.length < 10) {
        setError("Enter a valid Safaricom number, e.g. 07xx or 2547xx.");
        setStatus("failed");
        return;
      }

      if (amount <= 0) {
        setError("Amount must be greater than zero.");
        setStatus("failed");
        return;
      }

      const reference = `DUKA-${Date.now().toString(36).toUpperCase()}`;
      const payload: MpesaStkMeta = {
        phoneNumber: normalizedPhone,
        amount,
        reference,
        initiatedAt: Date.now(),
      };

      setMeta(payload);
      setError(null);
      setStatus("pending");

      // Simulate Daraja 2.0 STK push lifecycle
      window.setTimeout(() => {
        const willFail = Math.random() < failureRate;

        if (willFail) {
          setStatus("failed");
          setError("Transaction failed or was cancelled on phone.");
          return;
        }

        setStatus("success");
      }, simulatedDelayMs);
    },
    [failureRate, simulatedDelayMs]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setMeta(null);
    setError(null);
  }, []);

  return {
    status,
    meta,
    error,
    isIdle: status === "idle",
    isPending: status === "pending",
    isSuccess: status === "success",
    isFailed: status === "failed",
    initiateStkPush,
    reset,
  };
};


