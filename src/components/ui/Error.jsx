import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  title = "Error"
}) => {
  return (
    <div className="animate-fadeIn flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full mx-auto">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 mb-6">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="w-full">
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Error;