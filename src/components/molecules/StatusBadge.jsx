import React from "react";
import { cn } from "@/utils/cn";

const StatusBadge = ({ status, className }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return {
          text: "Present",
          className: "bg-green-100 text-green-800 border-green-200"
        };
      case "absent":
        return {
          text: "Absent",
          className: "bg-red-100 text-red-800 border-red-200"
        };
      case "late":
        return {
          text: "Late",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200"
        };
      case "active":
        return {
          text: "Active",
          className: "bg-blue-100 text-blue-800 border-blue-200"
        };
      case "inactive":
        return {
          text: "Inactive",
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
      default:
        return {
          text: status || "Unknown",
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.text}
    </span>
  );
};

export default StatusBadge;