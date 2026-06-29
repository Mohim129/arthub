import Link from "next/link";
import { Card } from "@heroui/react";

export default function CategoryCard({ category }) {
  const IconComponent = category.icon;
  return (
    <Link href={category.href} className="group h-full flex flex-col">
      <Card
        className="bg-surface-container-low dark:bg-inverse-surface/40 rounded-xl hover:bg-primary hover:text-on-primary dark:hover:text-inverse-on-surface transition-all duration-300 shadow-sm border border-outline-variant/20 dark:border-outline-variant/10 text-on-surface dark:text-inverse-on-surface h-full flex flex-col justify-center"
        shadow="none"
      >
        <div className="flex flex-col items-center justify-center p-6 h-full w-full">
          <IconComponent className="text-[40px] mb-4 text-primary dark:text-primary-fixed-dim group-hover:text-current transition-colors" />
          <span className="font-h3 text-h3 text-center">{category.name}</span>
        </div>
      </Card>
    </Link>
  );
}
