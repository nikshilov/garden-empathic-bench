interface Stat {
  value: string;
  label: string;
}

export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105"
        >
          <div className="gradient-text font-serif text-4xl font-bold">
            {stat.value}
          </div>
          <div className="mt-2 text-sm font-medium text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
