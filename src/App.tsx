import { throttle } from "lodash";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
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
  getNestedItem,
  isDraggingOverDescendants,
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
    const activeItem = getNestedItem({ id: "", nodes: items }, activeId);
    if (!activeId || !activeItem) {
      return null;
    }

    return <Item id={activeId} title={`Item ${activeId}`} />;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragMove = throttle((event: DragMoveEvent) => {
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

    // edge case (avoid handling drag over for child nodes)
    if (
      "nodes" in activeItem &&
      isDraggingOverDescendants(activeItem, overId)
    ) {
      return;
    }

    if (
      Math.abs(
        (over?.rect.top || Number.MIN_SAFE_INTEGER) -
          (active.rect.current.translated?.top || Number.MAX_SAFE_INTEGER)
      ) < 20
    ) {
      updatedItems = moveNestedItem(
        items,
        activeId,
        overId,
        activeItem,
        overItem,
        activeParent,
        overParent,
        "before"
      );
      setItems(updatedItems);
      return;
    }

    if (
      Math.abs(
        (over?.rect.bottom || Number.MIN_SAFE_INTEGER) -
          (active.rect.current.translated?.bottom || Number.MAX_SAFE_INTEGER)
      ) < 20
    ) {
      updatedItems = moveNestedItem(
        items,
        activeId,
        overId,
        activeItem,
        overItem,
        activeParent,
        overParent,
        "after"
      );
      setItems(updatedItems);
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
  }, 500);

  const handleDragEnd = (event: DragStartEvent) => {
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
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
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
      <DragOverlay>{getDragOverlay()}</DragOverlay>
    </DndContext>
  );
};

export default App;
