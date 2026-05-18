import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EnvironmentSwitcher } from "@/components/EnvironmentSwitcher";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
export const metadata = {
    title: "Zfit",
    description: "Elite Personal Training SaaS Platform",
};
export default function RootLayout({ children, }) {
    return (<html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark theme-custom`}>
      <body className="min-h-full flex flex-col pt-14">
        {process.env.NODE_ENV === "development" && <EnvironmentSwitcher />}
        {children}
      </body>
    </html>);
}
