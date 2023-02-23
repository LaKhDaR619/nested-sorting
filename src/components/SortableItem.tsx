import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  parentPath: string;
}

const StyledContainer = styled.div``;

const SortableItem: React.FC<PropsWithChildren<SortableItemProps>> = ({
  id,
  parentPath,
  children,
}) => {
  const path = parentPath ? `${parentPath}:${id}` : id;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { path } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <StyledContainer ref={setNodeRef} style={style}>
      <button {...listeners} {...attributes}>
        Drag handle
      </button>
      {path}
      {children}
    </StyledContainer>
  );
};

export default SortableItem;
