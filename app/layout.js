// app/layout.js
import './globals.css';
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: 'F1 Companion AI',
  description: 'AI-powered F1 chat assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
