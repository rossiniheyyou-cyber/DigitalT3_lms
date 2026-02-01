import "./globals.css";
import Header from "@/components/layout/Header";
import { CanonicalStoreProvider } from "@/context/CanonicalStoreContext";
import AIChatWidget from "@/components/global/AIChatWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <CanonicalStoreProvider>
          <Header />
          {children}
          <AIChatWidget />
        </CanonicalStoreProvider>
      </body>
    </html>
  );
}
