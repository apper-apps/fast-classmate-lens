import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ 
  title, 
  subtitle, 
  onMobileMenuToggle,
  searchValue = "",
  onSearchChange,
  showSearch = false,
  actions = []
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          {showSearch && (
            <div className="hidden sm:block">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search students..."
                className="w-80"
              />
            </div>
          )}

          {/* Actions */}
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || "default"}
              size={action.size || "default"}
              className={action.className}
            >
              {action.icon && (
                <ApperIcon name={action.icon} size={16} className="mr-2" />
              )}
              <span className="hidden sm:inline">{action.label}</span>
              <span className="sm:hidden">
                <ApperIcon name={action.icon || "Plus"} size={16} />
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="sm:hidden mt-4">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search students..."
            className="w-full"
          />
        </div>
      )}
    </header>
  );
};

export default Header;