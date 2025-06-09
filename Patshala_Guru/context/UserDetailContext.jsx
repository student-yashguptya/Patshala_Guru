import React, { createContext, useState } from "react";

// Create the context
export const UserDetailContext = createContext();

// Create the provider component
export const UserDetailProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};
