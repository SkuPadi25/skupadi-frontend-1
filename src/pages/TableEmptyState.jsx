// components/TableEmptyState.jsx
import { Inbox } from "lucide-react";

export default function TableEmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
  colSpan = 100
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Icon className="w-10 h-10 text-gray-400 mb-4" />

          <h3 className="text-sm font-semibold text-gray-900">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm text-gray-500 max-w-md">
              {description}
            </p>
          )}

          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="mt-4 px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
