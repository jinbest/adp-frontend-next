import styled, { keyframes, css } from "styled-components";

const bubble = keyframes`
  0%,
  80%,
  100% {
    box-shadow: 0 1.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 1.5em 0 0;
  }
`;

export default styled.div`
  color: ${props => props.color || "#262626"};
  font-size: ${props => props.size || "10px"};
  opacity: 0.5;
  margin: 0 auto;
  margin-top: -25px;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
  &,
  &:before,
  &:after {
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation: ${bubble} 1.8s infinite ease-in-out;
    animation: ${bubble} 1.8s infinite ease-in-out;
  }
  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
  }
  &:before {
    left: -2.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  &:after {
    left: 2.5em;
  }
  ${props =>
    props.space &&
    css`
      margin-bottom: ${props.space.length || "50px"};
    `}
`;
