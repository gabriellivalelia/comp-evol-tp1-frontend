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

export const ContentSection = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 900px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.8s ease-out;

  h1 {
    font-size: 2.8rem;
    color: ${Colors.BROWN};
    margin-bottom: 2rem;
    font-weight: 800;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
    position: relative;
    display: inline-block;

    &::after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 60%;
      height: 4px;
      background: linear-gradient(90deg, ${Colors.BROWN}, transparent);
      border-radius: 2px;
    }
  }

  p {
    font-size: 1.1rem;
    line-height: 1.9;
    color: #444;
    margin-bottom: 1.5rem;
    text-align: justify;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
      text-align: left;
    }
  }
`;

export const SidebarSection = styled.div`
  position: sticky;
  top: 2rem;
  height: fit-content;
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: backwards;

  @media (max-width: 968px) {
    width: 100%;
    position: relative;
    top: 0;
    margin-top: 2rem;
  }
`;

export const SidebarTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
`;

export const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const ImageCard = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  position: relative;
  transition: all 0.4s ease;
  animation: ${slideIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const FixedImageCard = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const DishImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;

  ${ImageCard}:hover & {
    transform: scale(1.05);
  }
`;

export const FixedLogoImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

export const ImageCaption = styled.p`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  padding: 1.5rem 0.5rem 0.5rem;
  margin: 0;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 500;
`;

export const LogoSection = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid ${Colors.BROWN}20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

export const CompetitionLogo = styled.img`
  width: 250px;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const OfficialLink = styled.a`
  color: ${Colors.BROWN};
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${Colors.BROWN};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${Colors.BROWN};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;
