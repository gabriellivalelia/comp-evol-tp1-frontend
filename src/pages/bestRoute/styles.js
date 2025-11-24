import styled, { keyframes } from "styled-components";
import { Colors } from "../../globalConfigs";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const PageContainer = styled.div`
  display: flex;
  min-height: 100%;
  background: ${Colors.LIGHT_ORANGE};

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

export const Sidebar = styled.div`
  width: 400px;
  background: white;
  padding: 2rem;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  animation: ${slideInLeft} 0.8s ease-out;

  @media (max-width: 968px) {
    width: 100%;
    max-height: 40vh;
  }
`;

export const SidebarHeader = styled.div`
  margin-bottom: 2rem;
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  color: ${Colors.DARK_ORANGE};
  margin-bottom: 0.5rem;
  font-weight: 800;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 80%;
    height: 4px;
    background: linear-gradient(90deg, ${Colors.DARK_ORANGE}, transparent);
    border-radius: 2px;
  }
`;

export const RouteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;

  span:first-child {
    color: #666;
    font-weight: 500;
  }

  span:last-child {
    color: ${Colors.BROWN};
    font-weight: 700;
  }
`;

export const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BarCard = styled.div`
  background: ${(props) =>
    props.isActive ? "linear-gradient(135deg, #FF6B35, #FF8C61)" : "white"};
  border: 2px solid ${(props) => (props.isActive ? "#FF6B35" : "#e0e0e0")};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${(props) => props.delay || "0s"};
  animation-fill-mode: backwards;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
    border-color: #ff6b35;
  }
`;

export const BarNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) =>
    props.isActive ? "white" : "linear-gradient(135deg, #FF6B35, #FF8C61)"};
  color: ${(props) => (props.isActive ? "#FF6B35" : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
`;

export const BarInfo = styled.div`
  flex: 1;
`;

export const BarName = styled.h3`
  font-size: 1.1rem;
  color: ${(props) => (props.isActive ? "white" : Colors.BROWN)};
  margin: 0 0 0.3rem 0;
  font-weight: 700;
`;

export const BarAddress = styled.p`
  font-size: 0.85rem;
  color: ${(props) => (props.isActive ? "rgba(255, 255, 255, 0.9)" : "#666")};
  margin: 0;
  line-height: 1.4;
`;

export const BarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: ${(props) => (props.isActive ? "white" : "#FFB800")};
  font-weight: 600;
  margin-top: 0.3rem;
`;

export const MapContainer = styled.div`
  flex: 1;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: backwards;

  @media (max-width: 968px) {
    height: 60vh;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 249, 230, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  gap: 1rem;
`;

export const LoadingText = styled.p`
  font-size: 1.2rem;
  color: ${Colors.BROWN};
  font-weight: 600;
`;

export const ExportButton = styled.button`
  background: linear-gradient(135deg, #2d6a4f, #40916c);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;
