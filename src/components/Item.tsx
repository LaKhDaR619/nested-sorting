import React, { PropsWithChildren } from "react";
import styled from "styled-components";

interface SortableItemProps {
  id: string;
  title: string;
}

const StyledContainer = styled.div`
  background-color: lightsalmon;
`;

const Item: React.FC<PropsWithChildren<SortableItemProps>> = ({ title }) => {
  return <StyledContainer>{title}</StyledContainer>;
};

export default Item;
