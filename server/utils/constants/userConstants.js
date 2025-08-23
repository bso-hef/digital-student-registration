export const USER = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
  INVITED: "INVITED",
  PENDING: "PENDING",
  EXPIRED: "EXPIRED",
  REGISTERED: "REGISTERED",
  EXTERNAL: "external",
  INTERNAL: "internal",
  EXTERNAL_LOGINS: Object.freeze({
    SOURCE: "source",
    SOUCE_ID: "sourceId",
    SOURCE_TYPE: Object.freeze({
      LDAP: "ldap",
      OIDC: "oidc",
      SAML: "saml",
    }),
  }),
  EVENTS: Object.freeze({
    ON_UPDATE_ONLINE_STATUS: "onUpdateOnlineStatus",
    ON_ACTIVATED: "onActivated",
    ON_DEACTIVATED: "onDeactivated",
  }),
});

export const ERRORS = {
  INVALID_CREDS: "INVALID_CREDS",
  REGISTER_USER: "REGISTER_USER",
};
