export function formatTime(time24?: string): string {
  if (!time24) return "-";
  const date = new Date(`1970-01-01T${time24}`);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
