import SidebarLayout from "@/components/sidebar-layout";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarLayout>{children}</SidebarLayout>
        <Toaster />
      </body>
    </html>
  );
}
