import React, { PropsWithChildren } from "react";
import { ItemType } from "../App";
import SortableItem from "./SortableItem";
import Item from "./Item";

import styled from "styled-components";
import SortableContainer from "./SortableContainer";

interface SortableContainerProps {
  id: string;
  nodes: ItemType[];
  parentPath: string;
}

const StyledContainer = styled.div`
  background-color: lightgray;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px solid yellowgreen;
  border-radius: 8px;
`;

const Container: React.FC<PropsWithChildren<SortableContainerProps>> = ({
  id,
  nodes,
  parentPath,
}) => {
  const path = parentPath ? `${parentPath}:${id}` : id;

  return (
    <StyledContainer>
      <span>{`Container ${id}`}</span>
      {nodes.map((item) => {
        if ("nodes" in item) {
          return (
            <SortableContainer
              key={item.id}
              id={item.id}
              nodes={item.nodes}
              parentPath={path}
            >
              <Container id={item.id} nodes={item.nodes} parentPath={path} />
            </SortableContainer>
          );
        }

        return (
          <SortableItem key={item.id} id={item.id} parentPath={path}>
            <Item id={item.id} title={item.data} />
          </SortableItem>
        );
      })}
    </StyledContainer>
  );
};

export default Container;
