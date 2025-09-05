import React from "react";
import { cn } from "@/utils/cn";
import { getLetterGrade, getGradeBadgeClass } from "@/utils/gradeUtils";

const GradeBadge = ({ average, className }) => {
  const letterGrade = getLetterGrade(average);
  const badgeClass = getGradeBadgeClass(letterGrade);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        badgeClass,
        className
      )}
    >
      {letterGrade} ({average}%)
    </span>
  );
};

export default GradeBadge;