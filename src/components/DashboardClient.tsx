"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { useEffect, useState } from "react";
import SortableWidget from "@/components/SortableWidget";
import { useSession } from "next-auth/react";

interface WidgetItem {
  id: string;
  component: React.ComponentType<any>;
}

interface DashboardClientProps {
  widgets: WidgetItem[];
}

const STORAGE_KEY = "dashboard-layout";

export default function DashboardClient({ widgets }: DashboardClientProps) {
  const [items, setItems] = useState<WidgetItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);

  // ✅ GET REAL USER
  const { data: session } = useSession();
  const userId = session?.user?.email; // or id if available

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load layout + hidden
  useEffect(() => {
    const savedLayout = localStorage.getItem(STORAGE_KEY);
    const savedHidden = localStorage.getItem("hidden-widgets");

    if (savedHidden) {
      setHidden(JSON.parse(savedHidden));
    }

    if (savedLayout) {
      try {
        const parsedIds: string[] = JSON.parse(savedLayout);

        const ordered = parsedIds
          .map((id) => widgets.find((w) => w.id === id))
          .filter(Boolean) as WidgetItem[];

        const missing = widgets.filter(
          (w) => !ordered.some((o) => o.id === w.id)
        );

        setItems([...ordered, ...missing]);
      } catch {
        setItems(widgets);
      }
    } else {
      setItems(widgets);
    }
  }, [widgets]);

  // Save layout
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.map((i) => i.id))
    );
  }, [items]);

  // Save hidden
  useEffect(() => {
    localStorage.setItem("hidden-widgets", JSON.stringify(hidden));
  }, [hidden]);

  // ✅ FIXED HANDLE DRAG END
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);

      const updated = arrayMove(prev, oldIndex, newIndex);

      // 🔥 DB SYNC (FIXED USER)
      if (userId) {
        fetch("/api/dashboard-layout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            layout: updated.map((i) => i.id),
          }),
        });
      }

      return updated;
    });
  }

  function resetLayout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("hidden-widgets");
    setItems(widgets);
    setHidden([]);
  }

  function toggleHide(id: string) {
    setHidden((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={() => setEditMode((p) => !p)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {editMode ? "Done Editing" : "Edit Layout"}
        </button>

        <button
          onClick={resetLayout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reset Layout
        </button>
      </div>

      {/* Hidden widgets */}
      {editMode && hidden.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="text-sm font-medium">Hidden:</span>

          {hidden.map((id) => (
            <button
              key={id}
              onClick={() =>
                setHidden((prev) => prev.filter((x) => x !== id))
              }
              className="rounded bg-gray-700 px-2 py-1 text-xs text-white"
            >
              Show {id}
            </button>
          ))}
        </div>
      )}

      {/* Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {items
              .filter((w) => !hidden.includes(w.id))
              .map((widget) => {
                const Component = widget.component;

                return (
                  <SortableWidget
                    key={widget.id}
                    id={widget.id}
                    editMode={editMode}
                  >
                    <div
                      className={`relative rounded-xl border bg-white p-4 shadow-sm transition ${
                        editMode ? "cursor-move border-dashed" : ""
                      }`}
                    >
                      {editMode && (
                        <button
                          onClick={() => toggleHide(widget.id)}
                          className="absolute left-2 top-2 z-50 rounded bg-red-500 px-2 py-1 text-xs text-white"
                        >
                          Hide
                        </button>
                      )}

                      <Component />
                    </div>
                  </SortableWidget>
                );
              })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}