import React from "react";
import { ArrowUP, ArrowDown } from "../views/repair/widget-component";
import styled from "styled-components";

const Parentdiv = styled.div`
  display: flex;
  position: relative;
  height: 30px;
  width: 100%;
  align-items: center;
`;

const Contentdiv = styled.div`
  outline: none;
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 30px;
  width: 100%;
  align-items: center;
`;

const ContentP = styled.p`
  font-size: 14px;
  margin-left: 15px;
  font-weight: normal;
`;

const ArrowDiv = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 5px;
`;

type Props = {
  content: string;
  handlePrevState: () => void;
  handleNextState: () => void;
};

const CustomNumeric = ({
  content,
  handlePrevState,
  handleNextState,
}: Props) => {
  return (
    <Parentdiv>
      <Contentdiv>
        <ContentP>{content}</ContentP>
      </Contentdiv>
      <ArrowDiv>
        <div onClick={handleNextState} className="arrow-container">
          <ArrowUP />
        </div>
        <div onClick={handlePrevState} className="arrow-container">
          <ArrowDown />
        </div>
      </ArrowDiv>
    </Parentdiv>
  );
};

export default CustomNumeric;
