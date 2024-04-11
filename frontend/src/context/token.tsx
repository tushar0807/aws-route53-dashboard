import React, { createContext, useState } from "react";

export interface AuthState {
  token: string;
  isSignedIn: boolean;
  sessionId: string;
  userId: string;
  clientConnected : boolean;
  errorMsg? : string | null
}

const AuthContext = createContext<{
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>> | null;
  setNoti? : (msg: string, time: number) => void
}>({
  state: {
    token: "",
    isSignedIn: false,
    sessionId: "",
    userId: "",
    clientConnected : false
  },
  setState : null
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: "",
    isSignedIn: false,
    sessionId: "",
    userId: "",
    clientConnected : false
  });

  const setNoti = (msg : string , time : number)=>{
    setAuthState({...authState , errorMsg : msg})

    setTimeout(() => {
      setAuthState({...authState , errorMsg : null})
    }, time);
  }

  return (
    <AuthContext.Provider value={{ state: authState, setState: setAuthState , setNoti }}>
      {children}
    </AuthContext.Provider>
  );
};


export { AuthProvider, AuthContext };
