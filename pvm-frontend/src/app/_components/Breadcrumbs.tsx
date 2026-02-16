import React from "react";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { FormattedText } from "@/utils/textConverter";

interface BreadcrumbItem {
  label: string;
  href?: string;
  useFormat? : boolean; 
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-white/60 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-white" : "text-white/60"}>
                {item.useFormat ? 
                <FormattedText text={item.label} />  
                 : item.label
              }
              </span>
            )}
            {!isLast && (
              <IoChevronForward className="w-4 h-4 text-white/30" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};