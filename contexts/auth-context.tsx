"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Investor {
  name: string;
  password: string;
}

interface Employee {
  name: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  userType: "investor" | "employee" | null;
  login: (
    password: string,
    type: "investor" | "employee",
  ) => { success: boolean; name?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define your investors and their passwords
const INVESTORS: Investor[] = [
  {
    name: "Joseph Korm",
    password: process.env.NEXT_PUBLIC_INVESTOR_1_PASSWORD || "",
  },
  {
    name: "Saint Abraham",
    password: process.env.NEXT_PUBLIC_INVESTOR_2_PASSWORD || "",
  },
  {
    name: "Preston Pesiba Amnankwa",
    password: process.env.NEXT_PUBLIC_INVESTOR_3_PASSWORD || "",
  },
];

// Define your employees and their passwords
const EMPLOYEES: Employee[] = [
  {
    name: "Joseph Korm",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_1_PASSWORD || "",
  },
  {
    name: "Humphrey Obeng Mensah",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_2_PASSWORD || "",
  },
  {
    name: "Daniel Mensah",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_3_PASSWORD || "",
  },
  {
    name: "Alvin Asare",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_4_PASSWORD || "",
  },
  {
    name: "Jackson Budu",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_5_PASSWORD || "",
  },
  {
    name: "Jeffery Yeboah",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_6_PASSWORD || "",
  },
  {
    name: "Caleb Sackey",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_7_PASSWORD || "",
  },
  {
    name: "Diana Amano",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_8_PASSWORD || "",
  },
  {
    name: "Mercy Tetteh",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_9_PASSWORD || "",
  },
  {
    name: "Mavis Afriyie Sakyiwaa",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_10_PASSWORD || "",
  },
  {
    name: "Ewura Beniti Darkoah",
    password: process.env.NEXT_PUBLIC_EMPLOYEE_11_PASSWORD || "",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userType, setUserType] = useState<"investor" | "employee" | null>(
    null,
  );

  useEffect(() => {
    const auth = sessionStorage.getItem("investor-auth");
    if (auth) {
      const { name, type } = JSON.parse(auth);
      setIsAuthenticated(true);
      setUserName(name);
      setUserType(type);
    }
  }, []);

  const login = (password: string, type: "investor" | "employee") => {
    if (type === "investor") {
      const investor = INVESTORS.find((inv) => inv.password === password);
      if (investor) {
        setIsAuthenticated(true);
        setUserName(investor.name);
        setUserType("investor");
        sessionStorage.setItem(
          "investor-auth",
          JSON.stringify({
            authenticated: true,
            name: investor.name,
            type: "investor",
          }),
        );
        return { success: true, name: investor.name };
      }
    } else {
      const employee = EMPLOYEES.find((emp) => emp.password === password);
      if (employee) {
        setIsAuthenticated(true);
        setUserName(employee.name);
        setUserType("employee");
        sessionStorage.setItem(
          "investor-auth",
          JSON.stringify({
            authenticated: true,
            name: employee.name,
            type: "employee",
          }),
        );
        return { success: true, name: employee.name };
      }
    }
    return { success: false };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName(null);
    setUserType(null);
    sessionStorage.removeItem("investor-auth");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userName, userType, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
