import { Person, Paintbrush, ShoppingBag } from "@gravity-ui/icons";

const iconMap = { Person, Paintbrush, ShoppingBag };

export default function StatsCard({ stat }) {
  const Icon = iconMap[stat.icon] || Person;
  return (
    <div
      className={`glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 border-${stat.color}`}
    >
      <div className="flex justify-between items-center mb-sm">
        <Icon
          className={`text-${stat.color} p-xs bg-${stat.color}/10 rounded-lg`}
        />
        <span className="text-secondary font-label-caps">{stat.change}</span>
      </div>
      <p className="text-on-surface-variant font-label-caps">{stat.label}</p>
      <h3 className="text-h1-mobile font-bold text-on-surface">{stat.value}</h3>
    </div>
  );
}
