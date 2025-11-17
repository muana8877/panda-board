import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode; // ✅ added this line
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  children, // ✅ add children in destructuring
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg shadow-lg w-80 p-4">
        {title && <h2 className="font-bold text-lg mb-2">{title}</h2>}
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}

        {/* ✅ render children if any */}
        {children && <div className="mb-4">{children}</div>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded bg-red-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
