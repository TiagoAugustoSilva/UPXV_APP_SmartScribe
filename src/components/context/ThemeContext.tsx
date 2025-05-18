// context/ThemeContext.tsx
import React, { createContext, useState, useContext } from "react";

// Definição do tema (ajustável conforme necessário)
const lightTheme = {
  name: "light",
  background: "#fff",
  text: "#121212",
  border: "#ccc",
};

const darkTheme = {
  name: "dark",
  background: "#121212",
  text: "#fff",
  border: "#444",
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.name === "light" ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
