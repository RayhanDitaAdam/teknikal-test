export function UserAvatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "size-10 text-xs" : size === "md" ? "size-8 text-xs" : "size-7 text-[10px]";
  return (
    <div className={`flex ${sizeClass} items-center justify-center rounded-full bg-primary/10 font-medium`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
