"use client"
import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //   const {doctor,patient} = fetch 
    //   setuserData();
    // }, []);

    return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider
