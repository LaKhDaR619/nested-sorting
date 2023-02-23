import React, { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";

const Droppable: React.FC<PropsWithChildren> = ({ children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default Droppable;
