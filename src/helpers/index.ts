import { arrayMove } from "@dnd-kit/sortable";
import { ItemType, MultipleNodes } from "../App";

export const getItemAndParentByPath = (
  items: ItemType[],
  path: string
): {
  parent: MultipleNodes | null;
  item: ItemType;
} | null => {
  const pathIdsArray = path.split(":");
  if (!pathIdsArray.length) {
    return null;
  }
  let searchedItem = items.find((item) => item.id === pathIdsArray[0]);
  let parent: ItemType | null = null;
  pathIdsArray.slice(1).forEach((id) => {
    if (searchedItem && "nodes" in searchedItem) {
      parent = searchedItem;
      searchedItem = searchedItem.nodes.find((item) => item.id === id)!;
    }
  });

  if (!searchedItem) {
    return null;
  }

  return { parent, item: searchedItem };
};

export const moveNestedItem = (
  items: ItemType[],
  activeId: string,
  overId: string,
  activeItem: ItemType,
  overItem: ItemType,
  activeParent: MultipleNodes | null,
  overParent: MultipleNodes | null,
  // don't move to the over container, add it before or after it
  addNextTo?: "before" | "after"
) => {
  // if they have the same parent (just sorting)
  if (activeParent?.id === overParent?.id && !("nodes" in overItem)) {
    // they have parent
    if (activeParent) {
      const activeIndex = activeParent.nodes.findIndex(
        (node) => node.id === activeId
      );
      const overIndex = activeParent.nodes.findIndex(
        (node) => node.id === overId
      );
      activeParent.nodes = arrayMove(
        activeParent.nodes,
        activeIndex,
        overIndex
      );
      return JSON.parse(JSON.stringify(items));
    }
    // item are in root
    const activeIndex = items.findIndex((node) => node.id === activeId);
    const overIndex = items.findIndex((node) => node.id === overId);
    items = arrayMove(items, activeIndex, overIndex);
    return JSON.parse(JSON.stringify(items));
  }

  // diffrent parents
  // is dragged over multiple nodes
  if ("nodes" in overItem) {
    // delete old active item
    // item has parent
    if (activeParent) {
      activeParent.nodes = activeParent.nodes.filter(
        (item) => item.id !== activeId
      );
    }
    // item is in root
    else {
      items = items.filter((item) => item.id !== activeId);
    }

    // if we need to put it next to the container
    if (addNextTo === "before") {
      if (overParent) {
        overParent.nodes.unshift(activeItem);
      } else {
        items.unshift(activeItem);
      }
    } else if (addNextTo === "after") {
      if (overParent) {
        overParent.nodes.push(activeItem);
      } else {
        items.push(activeItem);
      }
    }
    // add it to the dragged over container
    else {
      overItem.nodes.unshift(activeItem);
    }

    return JSON.parse(JSON.stringify(items));
  }

  // is dragged over single node
  // Deleting from old place
  if (activeParent) {
    activeParent.nodes = activeParent.nodes.filter(
      (item) => item.id !== activeId
    );
  }
  // item to delete is in root
  else {
    items = items.filter((item) => item.id !== activeId);
  }

  // Adding to new place
  if (overParent) {
    overParent.nodes.unshift(activeItem);
  }
  // item to add to is in root
  else {
    const overIndex = items.findIndex((item) => item.id === overId);
    items.splice(overIndex, 0, activeItem);
  }

  return JSON.parse(JSON.stringify(items));
};

export const isDraggingOverDescendants = (
  item: ItemType,
  overId: string
): boolean => {
  // if we found the item
  if (item.id === overId) {
    return true;
  }

  // if we are in a single node and it isn't the overId
  if (!("nodes" in item)) {
    return false;
  }

  // didn't find keep checking
  return item.nodes.some((node) => isDraggingOverDescendants(node, overId));
};

export const getNestedItem = (
  item: ItemType,
  id: string | null
): ItemType | null => {
  if (!id) {
    return null;
  }

  if (item.id === id) {
    return item;
  }

  if ("nodes" in item) {
    return item.nodes.find((node) => getNestedItem(node, id)) || null;
  }

  return null;
};
