import SidebarLayout from "@/components/sidebar-layout";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/lib/store";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <SidebarLayout>{children}</SidebarLayout>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
