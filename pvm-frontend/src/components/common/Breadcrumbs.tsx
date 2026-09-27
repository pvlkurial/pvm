import { Fragment } from "react";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { FormattedText } from "./FormattedText";

interface BreadcrumbItem {
  label: string;
  href?: string;
  /** Render Trackmania formatting codes in the label. */
  useFormat?: boolean;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-small">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground" : "text-muted-foreground"}>
                {item.useFormat ? <FormattedText text={item.label} /> : item.label}
              </span>
            )}
            {!isLast && <IoChevronForward className="size-4 text-faint" />}
          </Fragment>
        );
      })}
    </nav>
  );
}
