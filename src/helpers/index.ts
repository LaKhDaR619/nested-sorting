import { ItemType, MultipleNodes } from "../App";

export const getItemAndParentByPath = (
  items: ItemType[],
  path: string
): {
  parent: ItemType | null;
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
