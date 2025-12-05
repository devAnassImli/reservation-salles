import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
};

export default Layout;
