import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function Draggable({ id, children }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = {
        transform: CSS.Translate.toString(transform),
    };
    return (
        <button
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="px-3 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        >
            {children}
        </button>
    );
}
