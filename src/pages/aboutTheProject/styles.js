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
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  min-height: 100%;
  background: ${Colors.LIGHT_ORANGE};
  padding: 3rem 2%;
  gap: 3%;

  @media (max-width: 968px) {
    flex-direction: column;
    padding: 2rem 1rem;
  }
`;

export const SidebarSection = styled.div`
  width: 320px;
  background: white;
  border-radius: 15px;
  padding: 2rem 1.5rem;
  position: sticky;
  top: 2rem;
  height: fit-content;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.15);
  animation: ${slideInLeft} 0.8s ease-out;

  @media (max-width: 968px) {
    width: 100%;
    position: relative;
    top: 0;
  }
`;

export const SidebarTitle = styled.h2`
  font-size: 1.6rem;
  color: #ff6b35;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #ff6b35, #ff8c61);
    border-radius: 2px;
  }
`;

export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    transform: translateX(5px);
  }
`;

export const MemberPhoto = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a90e2, #5ba3f5);
  border: 3px solid #e3f2fd;
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 1.5rem;
  }
`;

export const MemberInfo = styled.div`
  flex: 1;
`;

export const MemberName = styled.h3`
  font-size: 1.05rem;
  color: #2d6a4f;
  margin: 0 0 0.4rem 0;
  font-weight: 700;
`;

export const MemberBio = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

export const ContentSection = styled.div`
  flex: 1;
  max-width: 900px;
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 968px) {
    padding: 1.5rem;
    border-radius: 15px;
    margin-top: 2rem;
  }
`;

export const PageTitle = styled.h1`
  font-size: 2.8rem;
  color: #ff6b35;
  margin-bottom: 2rem;
  font-weight: 800;
  text-align: left;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 70%;
    height: 4px;
    background: linear-gradient(90deg, #ff6b35, #ff8c61);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const ContentText = styled.p`
  font-size: 1.1rem;
  line-height: 1.9;
  color: #444;
  margin-bottom: 1.5rem;
  text-align: justify;

  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: left;
  }
`;
