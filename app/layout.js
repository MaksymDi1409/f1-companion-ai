// app/layout.js
import './globals.css';
import { F1DataProvider } from './F1DataContext';

export const metadata = {
  title: 'F1 Companion AI',
  description: 'AI-powered F1 chat assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <F1DataProvider>
          {children}
        </F1DataProvider>
      </body>
    </html>
  );
}
