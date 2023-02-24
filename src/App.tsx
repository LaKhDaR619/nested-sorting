import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableContainer from "./components/SortableContainer";
import SortableItem from "./components/SortableItem";
import Item from "./components/Item";
import defaultItems from "./data/items";
import styled from "styled-components";
import Container from "./components/Container";
import {
  getItemAndParentByPath,
  isDragingInsideParent,
  moveNestedItem,
} from "./helpers";

type CommonItemProperties = { id: string };
export type MultipleNodes = CommonItemProperties & { nodes: ItemType[] };
export type DataNode = CommonItemProperties & { data: string };

export type ItemType = MultipleNodes | DataNode;

const StyledContainer = styled.div`
  width: 80vw;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const App = () => {
  const [items, setItems] = useState<ItemType[]>(defaultItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  const getDragOverlay = () => {
    const activeItem = items.find((item) => item.id === activeId);
    if (!activeId || !activeItem) {
      return null;
    }

    if ("nodes" in activeItem) {
      return (
        <Container id={activeItem.id} nodes={activeItem.nodes} parentPath="" />
      );
    }

    return <Item id={activeId} title={activeItem?.data} />;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const activeId = active.id.toString();
    const overId = over?.id.toString();
    if (!activeId || !overId || activeId === overId) {
      return;
    }

    let updatedItems = [...items];

    // getting active item
    const activePath: string = active.data.current?.["path"] || "";
    const activeResult = getItemAndParentByPath(updatedItems, activePath);
    if (!activeResult) {
      return;
    }
    const { item: activeItem, parent: activeParent } = activeResult;

    // getting overItem item
    const overPath: string = over?.data.current?.["path"] || "";
    const overResult = getItemAndParentByPath(updatedItems, overPath);
    if (!overResult) {
      return;
    }
    const { item: overItem, parent: overParent } = overResult;

    // we ignore dragging inside parent (just a sorting action)
    if (isDragingInsideParent(updatedItems, overId, activePath)) {
      return;
    }

    // edge case (avoid handling drag over for child nodes)
    if (
      "nodes" in activeItem &&
      activeItem.nodes.find((node) => node.id === overId)
    ) {
      return;
    }

    updatedItems = moveNestedItem(
      updatedItems,
      activeId,
      overId,
      activeItem,
      overItem,
      activeParent,
      overParent
    );
    setItems(updatedItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id.toString();
    const overId = over?.id.toString();
    if (!activeId || !overId || activeId === overId) {
      return;
    }

    let updatedItems = [...items];

    // getting active item
    const activePath: string = active.data.current?.["path"] || "";
    const activeResult = getItemAndParentByPath(updatedItems, activePath);
    if (!activeResult) {
      return;
    }
    const { item: activeItem, parent: activeParent } = activeResult;

    // getting overItem item
    const overPath: string = over?.data.current?.["path"] || "";
    const overResult = getItemAndParentByPath(updatedItems, overPath);
    if (!overResult) {
      return;
    }
    const { item: overItem, parent: overParent } = overResult;

    updatedItems = moveNestedItem(
      updatedItems,
      activeId,
      overId,
      activeItem,
      overItem,
      activeParent,
      overParent
    );
    setItems(updatedItems);
    setActiveId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      // announcements={defaultAnnouncements}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        id="root"
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <StyledContainer>
          {items.map((item) => {
            if ("nodes" in item) {
              return (
                <SortableContainer
                  key={item.id}
                  id={item.id}
                  nodes={item.nodes}
                  parentPath=""
                >
                  <Container id={item.id} nodes={item.nodes} parentPath="" />
                </SortableContainer>
              );
            }

            return (
              <SortableItem key={item.id} id={item.id} parentPath="">
                <Item id={item.id} title={item.data} />
              </SortableItem>
            );
          })}
        </StyledContainer>
      </SortableContext>
      {/* <DragOverlay>{getDragOverlay()}</DragOverlay> */}
    </DndContext>
  );
};

export default App;
