import { Inter } from "next/font/google";
import SidebarLayout from "@/components/Layout"; // Adjust the import path as needed
import "./globals.css";
import GlobalSearch from "@/components/GlobalSearch";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sumithra Ladies Tailor",
  description: "Generated for Sumithra Ladies Tailor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <GlobalSearch />
        <SidebarLayout>
          {children}
        </SidebarLayout>
      </body>
    </html>
  );
}
