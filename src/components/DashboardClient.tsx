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
import { useSession } from "next-auth/react";

import SortableWidget from "@/components/SortableWidget";

// Widgets
import PRMetrics from "@/components/PRMetrics";
import CommunityMetrics from "@/components/CommunityMetrics";
import PRBreakdownChart from "@/components/PRBreakdownChart";
import CommitTimeChart from "@/components/CommitTimeChart";
import StreakTracker from "@/components/StreakTracker";
import IssueMetrics from "@/components/IssueMetrics";
import CIAnalytics from "@/components/CIAnalytics";
import LanguageBreakdown from "@/components/LanguageBreakdown";
import TopRepos from "@/components/TopRepos";

interface WidgetItem {
  id: string;
}

interface DashboardClientProps {
  widgets: WidgetItem[];
}

const STORAGE_KEY = "dashboard-layout";
const HIDDEN_KEY = "hidden-widgets";

/**
 * Map widget IDs → components
 * (prevents passing components from server → client)
 */
const componentMap: Record<string, React.ComponentType<any>> = {
  prMetrics: PRMetrics,
  communityMetrics: CommunityMetrics,
  prBreakdown: PRBreakdownChart,
  commitTime: CommitTimeChart,
  streakTracker: StreakTracker,
  issueMetrics: IssueMetrics,
  ciAnalytics: CIAnalytics,
  languageBreakdown: LanguageBreakdown,
  topRepos: TopRepos,
};

export default function DashboardClient({
  widgets,
}: DashboardClientProps) {
  const [items, setItems] = useState<WidgetItem[]>(widgets);
  const [editMode, setEditMode] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);

  const { data: session } = useSession();
  const userId = session?.user?.email;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // =========================
  // Load saved layout
  // =========================
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedLayout = localStorage.getItem(STORAGE_KEY);
      const savedHidden = localStorage.getItem(HIDDEN_KEY);

      if (savedHidden) {
        setHidden(JSON.parse(savedHidden));
      }

      if (savedLayout) {
        const parsedIds: string[] = JSON.parse(savedLayout);

        const ordered = parsedIds
          .map((id) => widgets.find((w) => w.id === id))
          .filter(Boolean) as WidgetItem[];

        const missing = widgets.filter(
          (w) => !parsedIds.includes(w.id)
        );

        setItems([...ordered, ...missing]);
      }
    } catch {
      setItems(widgets);
    }
  }, [widgets]);

  // =========================
  // Save layout
  // =========================
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.map((i) => i.id))
    );
  }, [items]);

  // =========================
  // Save hidden widgets
  // =========================
  useEffect(() => {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(hidden));
  }, [hidden]);

  // =========================
  // Drag handler
  // =========================
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);

      const updated = arrayMove(prev, oldIndex, newIndex);

      // sync backend
      if (userId) {
        fetch("/api/dashboard-layout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            layout: updated.map((i) => i.id),
          }),
        }).catch(() => {});
      }

      return updated;
    });
  }

  // =========================
  // Reset layout
  // =========================
  function resetLayout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HIDDEN_KEY);
    setItems(widgets);
    setHidden([]);
  }

  // =========================
  // Toggle hide widget
  // =========================
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
              onClick={() => toggleHide(id)}
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
                const Component = componentMap[widget.id];

                if (!Component) return null;

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