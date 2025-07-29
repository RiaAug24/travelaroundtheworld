import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

// GraphQL mutations
const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!,) {
    register(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

// Types
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthAction {
  type: 'REGISTER' | 'LOGIN' | 'LOGOUT' | 'SET_LOADING' | 'AUTH_ERROR';
  payload?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: true, // Start with loading true to check existing token
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "REGISTER":
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
}

// Utility function to decode JWT token
function decodeToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check if token is expired
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }
    
    // Return user info from token (you might need to adjust based on your token structure)
    return {
      id: payload.id,
      username: payload.username || 'User',
      email: payload.email || '',
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const user = decodeToken(token);
        
        if (user) {
          dispatch({
            type: 'LOGIN',
            payload: { user, token }
          });
        } else {
          // Token is invalid or expired
          localStorage.removeItem('authToken');
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  const register = async (username: string, email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data } = await registerMutation({
        variables: { username, email, password }
      });

      const token = data.register.token;
      const user = decodeToken(token);

      if (user) {
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        dispatch({
          type: 'REGISTER',
          payload: { user, token }
        });
      } else {
        throw new Error('Invalid token received');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR' });
      throw new Error(error.message || 'Registration failed');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data } = await loginMutation({
        variables: { username, password }
      });

      const token = data.login.token;
      const user = decodeToken(token);

      if (user) {
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        dispatch({
          type: 'LOGIN',
          payload: { user, token }
        });
      } else {
        throw new Error('Invalid token received');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR' });
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };