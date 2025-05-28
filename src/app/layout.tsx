import { WalletContextProvider } from "@/components/WalletContextProvider";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KAWAI Dashboard",
  description: "Login and access the KAWAI ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Ensure no whitespace before body */}
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

