import { Inter } from "next/font/google";
import SidebarLayout from "@/components/sidebar-layout";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <SidebarLayout>{children}</SidebarLayout>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
