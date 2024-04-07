import React, { createContext, useState } from "react";

interface AuthState {
  token: string;
  isSignedIn: boolean;
  sessionId: string;
  userId: string;
  clientConnected : boolean
}

const AuthContext = createContext<{
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>> | null;
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

  return (
    <AuthContext.Provider value={{ state: authState, setState: setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};


export { AuthProvider, AuthContext };
