import React from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable({ children }) {
    const { isOver, setNodeRef } = useDroppable({
        id: "droppable",
    });

    return (
        <div
            ref={setNodeRef}
            className={`w-64 min-h-40 border-2 border-dashed rounded p-4 flex flex-col items-center justify-center transition ${
                isOver ? "border-green-500 bg-green-50" : "border-gray-400"
            }`}
        >
            {children}
        </div>
    );
}
