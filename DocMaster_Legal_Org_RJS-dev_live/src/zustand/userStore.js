// userStore.js
import CreateStore from "zustand";
import { reactLocalStorage } from "reactjs-localstorage";

import {
  userLocalSessionKey,
  userDefOrgLocalStorageKey,
} from "../configs/User.config";

/*
  This will help with state Management of LoggedIn User
*/
//  const userData = reactLocalStorage.getObject(userLocalSessionKey);

const userStore = CreateStore((set) => ({
  user: reactLocalStorage.getObject(userLocalSessionKey),
  // userDefaultOrg: reactLocalStorage.getObject(userDefOrgLocalStorageKey),
  setUser: (userData) => {
    reactLocalStorage.setObject(userLocalSessionKey, userData);
    set((state) => ({ user: userData }));
  },
  removeUser: () => {
    reactLocalStorage.remove(userLocalSessionKey);
    // reactLocalStorage.remove(userDefOrgLocalStorageKey);
    reactLocalStorage.clear();
    window.localStorage.clear();
    set((state) => ({
      user: reactLocalStorage.getObject(userLocalSessionKey),
    }));
  },
  // setUserDefaultOrg: (orgData) => {
  //   reactLocalStorage.setObject(userDefOrgLocalStorageKey, orgData);
  //   set((state) => ({ userDefaultOrg: orgData }));
  // },
}));

export default userStore;
