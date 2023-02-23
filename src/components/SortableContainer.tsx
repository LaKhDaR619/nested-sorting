import React, { PropsWithChildren } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { ItemType } from "../App";

interface SortableContainerProps {
  id: string;
  nodes: ItemType[];
  parentPath: string;
}

const SortableContainer: React.FC<
  PropsWithChildren<SortableContainerProps>
> = ({ id, nodes, parentPath, children }) => {
  return (
    <SortableItem id={id} parentPath={parentPath}>
      <SortableContext items={nodes} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </SortableItem>
  );
};

export default SortableContainer;
