import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  message = "Get started by adding your first item.",
  icon = "Inbox",
  action,
  actionLabel = "Add New"
}) => {
  return (
    <div className="animate-fadeIn flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full mx-auto">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full">
            <ApperIcon name={icon} size={32} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 mb-6">{message}</p>
          {action && (
            <Button onClick={action} className="w-full">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Empty;