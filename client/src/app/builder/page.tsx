"use client";

import React, { useState, ReactNode, RefObject, CSSProperties } from "react";
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ComponentType = "Navbar" | "Body" | "Footer";

interface SidebarDraggableProps {
    id: string;
    children: ReactNode;
}

interface SortableItemProps {
    id: string;
    children: ReactNode;
}

interface DroppableProps {
    children: ReactNode;
    dropRef?: RefObject<HTMLDivElement | null>;
}

interface DroppedComponent {
    id: string;
    type: ComponentType;
}

const Navbar = () => <div className="p-4 bg-blue-500 text-white rounded">Navbar</div>;
const Body = () => <div className="p-4 bg-green-500 text-white rounded">Body</div>;
const Footer = () => <div className="p-4 bg-gray-700 text-white rounded">Footer</div>;

function SidebarDraggable({ id, children }: SidebarDraggableProps) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id,
        data: { from: "sidebar" },
    });

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={{ cursor: "grab" }}>
            {children}
        </div>
    );
}

function SortableItem({ id, children }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || "transform 0.2s ease",
        cursor: "grab",
        marginBottom: "8px",
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

function Droppable({ children, dropRef }: DroppableProps) {
    const { isOver, setNodeRef } = useDroppable({ id: "drop-zone" });
    const style: CSSProperties = {
        border: "2px dashed",
        borderColor: isOver ? "green" : "gray",
        minHeight: "500px",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: isOver ? "#e0ffe0" : "#f9f9f9",
        width: "100%",
        position: "relative",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
    };

    return (
        <div
            ref={node => {
                setNodeRef(node);
                if (dropRef) dropRef.current = node;
            }}
            style={style}
        >
            {children}
        </div>
    );
}

export default function Home() {
    const [droppedComponents, setDroppedComponents] = useState<DroppedComponent[]>([]);
    const [activeDrag, setActiveDrag] = useState<any>(null);
    const [isDraggingSortable, setIsDraggingSortable] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(1);

    const sensors = useSensors(useSensor(PointerSensor));
    const dropZoneRef = React.useRef(null);

    const renderComponent = (type: ComponentType) => {
        if (type === "Navbar") return <Navbar />;
        if (type === "Body") return <Body />;
        if (type === "Footer") return <Footer />;
        return null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDrag(event.active);

        if (event.active?.data?.current?.from !== "sidebar") {
            setIsDraggingSortable(true);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // Drop desde sidebar
        if (active?.data?.current?.from === "sidebar" && over?.id === "drop-zone") {
            const instanceId = `${active.id}-${Date.now()}`;
            setDroppedComponents(prev => [...prev, { type: active.id as ComponentType, id: instanceId }]);
        }

        // Sortable dentro del workspace
        if (active?.data?.current?.from !== "sidebar" && over?.id && over?.id !== "drop-zone") {
            if (active.id !== over.id) {
                setDroppedComponents(items => {
                    const oldIndex = items.findIndex(i => i.id === active.id);
                    const newIndex = items.findIndex(i => i.id === over.id);
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        }

        setActiveDrag(null);
        setIsDraggingSortable(false);
    };

    const handleDragCancel = () => {
        setActiveDrag(null);
        setIsDraggingSortable(false);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="relative h-screen bg-gray-50">
                {/* Sidebar */}
                <div className="absolute top-4 left-4 w-48 p-4 bg-gray-100 space-y-4 rounded shadow-lg z-10">
                    <SidebarDraggable id="Navbar">
                        <Navbar />
                    </SidebarDraggable>
                    <SidebarDraggable id="Body">
                        <Body />
                    </SidebarDraggable>
                    <SidebarDraggable id="Footer">
                        <Footer />
                    </SidebarDraggable>
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeDrag && (
                        <div
                            style={{
                                pointerEvents: "none",
                                opacity: 0.95,
                                transform: `scale(${1.1 / currentZoom})`,
                                transition: "transform 0.2s ease",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                borderRadius: "8px",
                            }}
                        >
                            {renderComponent(
                                // Para sortable items el id tiene formato "type-timestamp"
                                activeDrag.data.current?.from === "sidebar"
                                    ? activeDrag.id
                                    : activeDrag.id.split("-")[0]
                            )}
                        </div>
                    )}
                </DragOverlay>

                {/* Workspace con TransformWrapper */}
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={3}
                    doubleClick={{ disabled: true }}
                    wheel={{ step: 0.1 }}
                    disabled={isDraggingSortable}
                >
                    {({ zoomIn, zoomOut, resetTransform, scale }: any) => {
                        setCurrentZoom(scale);

                        return (
                            <>
                                {/* Controles de Zoom */}
                                <div className="absolute top-4 right-4 space-x-2 z-10">
                                    <button
                                        onClick={() => zoomIn()}
                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                    >
                                        Zoom In
                                    </button>
                                    <button
                                        onClick={() => zoomOut()}
                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                    >
                                        Zoom Out
                                    </button>
                                    <button
                                        onClick={() => resetTransform()}
                                        className="px-3 py-1 bg-gray-500 text-white rounded"
                                    >
                                        Reset
                                    </button>
                                </div>

                                <TransformComponent>
                                    <div className="w-screen h-screen flex justify-center items-start p-16">
                                        <Droppable dropRef={dropZoneRef}>
                                            <SortableContext
                                                items={droppedComponents.map(c => c.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {droppedComponents.map(comp => (
                                                    <SortableItem key={comp.id} id={comp.id}>
                                                        {renderComponent(comp.type)}
                                                    </SortableItem>
                                                ))}
                                            </SortableContext>
                                        </Droppable>
                                    </div>
                                </TransformComponent>
                            </>
                        );
                    }}
                </TransformWrapper>
            </div>
        </DndContext>
    );
}
