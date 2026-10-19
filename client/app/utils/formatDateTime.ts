export function formatDateTime(dateInput: Date | string | number): string {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const timeStr = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const dateStr = date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return `${timeStr} · ${dateStr}`;
}
