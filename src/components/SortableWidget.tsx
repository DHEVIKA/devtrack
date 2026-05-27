"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableWidgetProps {
  id: string;
  children: React.ReactNode;
  editMode: boolean;
}

export default function SortableWidget({
  id,
  children,
  editMode,
}: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: !editMode, // ✅ IMPORTANT FIX
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative transition ${
        isDragging ? "z-50 opacity-80" : ""
      }`}
    >
      {/* Drag Handle */}
      {editMode && (
        <button
          {...attributes}
          {...listeners}
          className="absolute right-2 top-2 z-50 flex cursor-grab items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-white hover:bg-black/80"
        >
          <GripVertical size={16} />
        </button>
      )}

      {/* Widget Content */}
      <div
        className={`rounded-xl transition ${
          editMode ? "ring-1 ring-dashed ring-gray-300" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}