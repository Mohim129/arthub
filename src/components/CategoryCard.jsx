import Link from "next/link";
import { Card } from "@heroui/react";

export default function CategoryCard({ category }) {
  const IconComponent = category.icon;
  return (
    <Link href={category.href} className="group">
      <Card
        className="bg-surface-container-low dark:bg-inverse-surface/40 rounded-xl hover:bg-primary hover:text-on-primary dark:hover:text-inverse-on-surface transition-all duration-300 shadow-sm border border-outline-variant/20 dark:border-outline-variant/10 text-on-surface dark:text-inverse-on-surface"
        shadow="none"
      >
        <div className="flex flex-col items-center justify-center p-6">
          <IconComponent className="text-[40px] mb-4 text-primary dark:text-primary-fixed-dim group-hover:text-current transition-colors" />
          <span className="font-h3 text-h3">{category.name}</span>
        </div>
      </Card>
    </Link>
  );
}
