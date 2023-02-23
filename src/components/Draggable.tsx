import React, { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableProps {
  id: string;
}

const Draggable: React.FC<PropsWithChildren<DraggableProps>> = ({
  children,
  id,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
};

export default Draggable;
