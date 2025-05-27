import Header from "@/components/layout/header";
import React from "react";
import Footer from "../../components/layout/footer";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="px-3 md:px-6 py-8">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
