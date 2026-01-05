export type VatStatus = "vat-registered" | "non-vat";

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface BusinessProfile {
  businessName: string;
  kraPin?: string;
  vatStatus: VatStatus;
  sector: "retail" | "wholesale" | "services" | "other";
  location: string;
}

export interface PersistedWorkspace {
  user: UserAccount;
  profile: BusinessProfile | null;
}

export const WORKSPACE_STORAGE_KEY = "kra-ready-workspace-v1";


