import React, { PropsWithChildren } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ItemType } from "../App";
import styled from "styled-components";

interface SortableContainerProps {
  id: string;
  nodes: ItemType[];
  parentPath: string;
}

const StyledContainer = styled.div``;

const SortableContainer: React.FC<
  PropsWithChildren<SortableContainerProps>
> = ({ id, nodes, parentPath, children }) => {
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
      <SortableContext items={nodes} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </StyledContainer>
  );
};

export default SortableContainer;
