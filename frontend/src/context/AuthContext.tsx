import { createContext, useContext, useReducer } from "react";
import { AuthConextType } from "../types/types";


const AuthContext = createContext<AuthConextType>();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Invalid type!");
  }
}

const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email: string, password: string | number) {

    // Todo
    



    if (1) {
      dispatch({ type: "login", payload:  });
    }
  }
  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        user: user,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside the AuthProvider function");
  return context;
}

export { AuthProvider, useAuth };
