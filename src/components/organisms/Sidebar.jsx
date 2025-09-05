import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard"
    },
    {
      name: "Students",
      href: "/students",
      icon: "Users"
    },
    {
      name: "Grades",
      href: "/grades",
      icon: "GraduationCap"
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: "Calendar"
    }
  ];

  return (
    <div className={cn("bg-white border-r border-slate-200 h-full", className)}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg">
              <ApperIcon name="GraduationCap" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ClassMate Pro
              </h1>
              <p className="text-xs text-slate-500">Student Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  size={18} 
                  className={cn(
                    "mr-3 transition-colors duration-200",
                    isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-700"
                  )}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Teacher</p>
              <p className="text-xs text-slate-500">Academic Year 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;