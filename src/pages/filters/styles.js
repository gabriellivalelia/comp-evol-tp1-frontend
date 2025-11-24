import styled from "styled-components";
import { Colors } from "../../globalConfigs";

export const PageContainer = styled.div`
  min-height: 100%;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

export const PageTitle = styled.h1`
  font-size: 3rem;
  color: #ff6b35;
  margin-bottom: 0.5rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  font-weight: 400;
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 900px;
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 15px;
  }
`;

export const Section = styled.div`
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: ${(props) => (props.last ? "none" : "2px solid #f0f0f0")};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const SectionNumber = styled.div`
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
`;

export const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || "1fr 1fr"};
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #ff6b35;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LabelIcon = styled.span`
  font-size: 1.2rem;
`;

export const Input = styled.input`
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #fafafa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    background-color: white;
    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }

  &:hover {
    border-color: #ffb396;
  }
`;

export const Select = styled.select`
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FF6B35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.2rem;
  padding-right: 3rem;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    background-color: white;
    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
  }

  &:hover {
    border-color: #ffb396;
  }
`;

export const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #fafafa;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    background-color: white;
    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }

  &:hover {
    border-color: #ffb396;
  }
`;

export const TimeInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  input {
    flex: 1;
  }
`;

export const IconButton = styled.button`
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 10px;
  width: 45px;
  height: 45px;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 107, 53, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%);
  color: white;
  border: none;
  padding: 1.2rem 4rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(255, 107, 53, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

export const InfoBox = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 4px solid #2196f3;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  margin-top: 1rem;

  p {
    margin: 0;
    color: #1565c0;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  strong {
    color: #0d47a1;
  }
`;
