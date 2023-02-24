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
  let searchedItem: ItemType = items.find(
    (item) => item.id === pathIdsArray[0]
  )!;
  let parent: ItemType | null = null;
  pathIdsArray.slice(1).forEach((id) => {
    if ("nodes" in searchedItem) {
      parent = searchedItem;
      searchedItem = searchedItem.nodes.find((item) => item.id === id)!;
    }
  });

  return { parent, item: searchedItem };
};

export const isDragingInsideParent = (
  items: ItemType[],
  overId: string,
  path: string
) => {
  const pathIdsArray = path.split(":");

  // item is inside root
  if (pathIdsArray.length === 1) {
    return Boolean(
      items.find((item) => {
        return (
          // if the over item is a sibling
          item.id === overId &&
          // and not a container
          !("nodes" in item)
        );
      })
    );
  }

  // item is in a nested container
  let parent: MultipleNodes | undefined = items.find(
    (item) => item.id === pathIdsArray[0]
  ) as MultipleNodes;
  pathIdsArray.slice(1, -1).forEach((id) => {
    if (parent && "nodes" in parent) {
      parent = parent.nodes.find((node) => node.id === id) as MultipleNodes;
    }
  });

  if (
    parent?.id === overId ||
    parent.nodes.find((item) => {
      return (
        // if the over item is a sibling
        item.id === overId &&
        // and not a container
        !("nodes" in item)
      );
    })
  ) {
    return true;
  }

  return false;
};

export const moveNestedItem = (
  items: ItemType[],
  activeId: string,
  overId: string,
  activeItem: ItemType,
  overItem: ItemType,
  activeParent: MultipleNodes | null,
  overParent: MultipleNodes | null
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

    // add it to the dragged over container
    overItem.nodes.unshift(activeItem);

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
