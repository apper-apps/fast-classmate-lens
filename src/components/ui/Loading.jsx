import React from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="animate-fadeIn">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="skeleton h-6 w-32 rounded"></div>
          </div>
          <div className="divide-y divide-slate-200">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="px-6 py-4 flex items-center space-x-4">
                <div className="skeleton h-10 w-10 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded"></div>
                  <div className="skeleton h-3 w-1/2 rounded"></div>
                </div>
                <div className="skeleton h-6 w-16 rounded-full"></div>
                <div className="skeleton h-6 w-20 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="skeleton h-4 w-20 rounded"></div>
                  <div className="skeleton h-8 w-16 rounded"></div>
                  <div className="skeleton h-3 w-24 rounded"></div>
                </div>
                <div className="skeleton h-12 w-12 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="animate-fadeIn space-y-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="skeleton h-12 w-12 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded"></div>
                  <div className="skeleton h-3 w-1/2 rounded"></div>
                </div>
                <div className="skeleton h-8 w-20 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="skeleton h-4 w-24 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="skeleton h-8 w-16 rounded mb-2"></div>
              <div className="skeleton h-3 w-32 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="skeleton h-6 w-40 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="skeleton h-10 w-10 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded"></div>
                  <div className="skeleton h-3 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;