export type AuthProviderId = "google" | "facebook";

export type AuthProviderConfig = {
  id: AuthProviderId;
  label: string;
  enabled: boolean;
  scopes: string;
};

export const authProviders: Record<AuthProviderId, AuthProviderConfig> = {
  google: {
    id: "google",
    label: "Google",
    enabled: true,
    scopes: "openid email profile"
  },
  facebook: {
    id: "facebook",
    label: "Facebook",
    enabled: false,
    scopes: "email,public_profile"
  }
};
