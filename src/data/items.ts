import { ItemType } from "../App";

const defaultItems: ItemType[] = [
  { id: "1", data: "item 1" },
  {
    id: "2",
    nodes: [
      // { id: "6", data: "item 6" },
      // { id: "7", data: "item 7" },
    ],
  },
  { id: "3", data: "item 3" },
  {
    id: "4",
    nodes: [
      { id: "8", data: "item 8" },
      { id: "9", data: "item 9" },
      { id: "13", nodes: [{ id: "14", data: "Item: 14" }] },
    ],
  },
  { id: "5", data: "item 5" },
  { id: "10", data: "item 10" },
  { id: "11", data: "item 11" },
  { id: "12", data: "item 12" },
];

export default defaultItems;
