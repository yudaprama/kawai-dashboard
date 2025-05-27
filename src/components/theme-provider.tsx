
"use client"; // Add use client directive

import * as React from "react"; // Import React
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Correct the import for ThemeProviderProps
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: NextThemesProviderProps) { // Use the correctly imported type
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

