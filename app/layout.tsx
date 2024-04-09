import { Inter } from "next/font/google";
import "./globals.css";
import HotToast from "./context/HotToast";
import AuthContext from "./context/AuthContext";
import ActiveStatus from "./components/ActiveStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TalkMe",
  description: "Nothing just chat to learn about  the web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <HotToast />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
