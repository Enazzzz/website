"use client";

import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

/**
 * Shared shape for sortable entities.
 */
export interface SortableEntity {
	id: string;
}

/**
 * Renders a reorderable list with drag handles.
 */
export function SortableList<T extends SortableEntity>({
	items,
	onReorder,
	renderItem,
	emptyLabel,
}: {
	items: T[];
	onReorder: (items: T[]) => void;
	renderItem: (item: T, index: number) => ReactNode;
	emptyLabel?: string;
}) {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	/**
	 * Handles drop events and persists item ordering in state.
	 */
	function handleDragEnd(event: DragEndEvent): void {
		const { active, over } = event;
		if (!over || active.id === over.id) {
			return;
		}
		const oldIndex = items.findIndex((item) => item.id === active.id);
		const newIndex = items.findIndex((item) => item.id === over.id);
		if (oldIndex < 0 || newIndex < 0) {
			return;
		}
		onReorder(arrayMove(items, oldIndex, newIndex));
	}

	if (items.length === 0) {
		return <p className="text-sm text-white/60">{emptyLabel ?? "No items yet."}</p>;
	}

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			<SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
				<div className="grid gap-3">
					{items.map((item, index) => (
						<SortableListItem key={item.id} id={item.id}>
							{renderItem(item, index)}
						</SortableListItem>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}

/**
 * Single sortable row with accessible drag handle.
 */
function SortableListItem({
	id,
	children,
}: {
	id: string;
	children: ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style} className="rounded-xl border border-white/10 bg-black/10 p-3">
			<div className="flex items-start gap-3">
				<button
					type="button"
					className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/70 hover:border-[color:var(--accent)]"
					{...attributes}
					{...listeners}
					aria-label="Drag to reorder"
				>
					Drag
				</button>
				<div className="min-w-0 flex-1">{children}</div>
			</div>
		</div>
	);
}
