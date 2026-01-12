// export const saveLS = (key: string, value: any) => {
//   localStorage.setItem(key, JSON.stringify(value));
// };

// export const getLS = (key: string) => {
//   try {
//     const item = localStorage.getItem(key);
//     return item ? JSON.parse(item) : null;
//   } catch {
//     return null;
//   }
// };

// export const clearLS = (key: string) => {
//   localStorage.removeItem(key);
// };

// export const clearOnboarding = () => {
//   clearLS("schoolInfo");
//   clearLS("ownerInfo");
// };


// src/utils/storage.js
const LS_KEYS = {
  REGISTRATION: "skp_registrationInfo",
  SCHOOL_ID: "skp_schoolId",
  SCHOOL_INFO: "skp_schoolInfo",
  USER: "skp_user",
  ACCESS_TOKEN: "skp_accessToken",
  REFRESH_TOKEN: "skp_refreshToken",
};

export const saveLS = (key, value) => {
  const v = typeof value === "string" ? value : JSON.stringify(value);
  localStorage.setItem(key, v);
};

export const getLS = (key) => {
  const v = localStorage.getItem(key);
  if (v == null) return null;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

export const removeLS = (key) => localStorage.removeItem(key);

export const clearOnboarding = () => {
  removeLS(LS_KEYS.REGISTRATION);
  removeLS(LS_KEYS.SCHOOL_ID);
  removeLS(LS_KEYS.SCHOOL_INFO);
};

export const saveRegistration = (obj) => saveLS(LS_KEYS.REGISTRATION, obj);
export const getRegistration = () => getLS(LS_KEYS.REGISTRATION);

export const saveSchoolId = (id) => saveLS(LS_KEYS.SCHOOL_ID, id);
export const getSchoolId = () => getLS(LS_KEYS.SCHOOL_ID);

export const saveSchoolInfo = (obj) => saveLS(LS_KEYS.SCHOOL_INFO, obj);
export const getSchoolInfo = () => getLS(LS_KEYS.SCHOOL_INFO);

export const saveAuthTokens = ({ accessToken, refreshToken }) => {
  saveLS(LS_KEYS.ACCESS_TOKEN, accessToken);
  saveLS(LS_KEYS.REFRESH_TOKEN, refreshToken);
};

export const getAccessToken = () => getLS(LS_KEYS.ACCESS_TOKEN);
export const getRefreshToken = () => getLS(LS_KEYS.REFRESH_TOKEN);

export const saveUser = (user) => saveLS(LS_KEYS.USER, user);
export const getUser = () => getLS(LS_KEYS.USER);

export const clearAuth = () => {
  removeLS(LS_KEYS.ACCESS_TOKEN);
  removeLS(LS_KEYS.REFRESH_TOKEN);
  removeLS(LS_KEYS.USER);
};

export { LS_KEYS };
