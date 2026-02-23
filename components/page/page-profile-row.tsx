interface ProfileRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  breakAll?: boolean;
}

export function ProfileRow({
  icon,
  iconBg,
  label,
  value,
  breakAll,
}: ProfileRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground font-anyvid mb-1">
          {label}
        </p>
        <p
          className={`text-sm font-anyvid text-gray-900 ${breakAll ? "break-all" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
