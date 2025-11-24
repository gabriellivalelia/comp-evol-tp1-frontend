import styled, { keyframes } from "styled-components";
import { BreakPoints, Colors, FontSizes } from "../../globalConfigs";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background: ${Colors.LIGHT_ORANGE};
  padding: 4rem 2rem;
  gap: 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: ${BreakPoints.MOBILE}) {
    padding: 2rem 1rem;
    gap: 1rem;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 900px;
  animation: ${fadeIn} 1s ease-out;
  z-index: 1;
`;

export const PrimaryText = styled.div`
  font-size: ${FontSizes.XXXXLARGE};
  color: ${Colors.DARK_ORANGE};
  font-weight: 800;
  line-height: 1.3;
  margin-top: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 1.2s ease-out;
  animation-delay: 0.6s;
  animation-fill-mode: backwards;

  @media (max-width: ${BreakPoints.MOBILE}) {
    font-size: ${FontSizes.XXXLARGE};
  }
`;

export const SecondaryText = styled.div`
  font-size: ${FontSizes.XXLARGE};
  color: ${(props) => props.color || Colors.BROWN};
  font-family: "Phudu", sans-serif;
  font-weight: 600;
  line-height: 1.4;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: ${(props) => props.delay || "0.3s"};
  animation-fill-mode: backwards;

  span {
    font-weight: 800;
    text-transform: uppercase;
    position: relative;
    display: inline-block;

    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 3px;
      background: ${Colors.GREEN};
      border-radius: 2px;
    }
  }

  @media (max-width: ${BreakPoints.MOBILE}) {
    font-size: ${FontSizes.XLARGE};
  }
`;

export const CTAButton = styled.button`
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%);
  color: white;
  border: none;
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 3rem;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.9s;
  animation-fill-mode: backwards;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(255, 107, 53, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: ${BreakPoints.MOBILE}) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;
