import React from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = "primary", 
  trend,
  className 
}) => {
  const colorClasses = {
    primary: "text-primary bg-blue-50",
    secondary: "text-secondary bg-purple-50",
    success: "text-success bg-green-50",
    warning: "text-warning bg-yellow-50",
    error: "text-error bg-red-50"
  };

  return (
    <Card className={cn("card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-bold text-slate-900 font-display">
                {value}
              </h3>
              {trend && (
                <span className={cn(
                  "text-sm font-medium",
                  trend.type === "up" ? "text-success" : "text-error"
                )}>
                  {trend.type === "up" ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-lg",
              colorClasses[color]
            )}>
              <ApperIcon name={icon} size={24} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;