import { ReactNode } from "react";
import DisclaimerBar from "./DisclaimerBar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DisclaimerBar />
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
