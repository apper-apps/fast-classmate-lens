import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const TableHeader = ({ title, sortable = false, onSort, sortDirection, className }) => {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider",
        sortable && "cursor-pointer hover:text-slate-700 select-none",
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center space-x-1">
        <span>{title}</span>
        {sortable && (
          <ApperIcon 
            name={sortDirection === "asc" ? "ChevronUp" : "ChevronDown"} 
            size={12}
            className={cn(
              "opacity-50",
              sortDirection && "opacity-100"
            )}
          />
        )}
      </div>
    </th>
  );
};

export default TableHeader;