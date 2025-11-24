import { useNavigate } from "react-router-dom";
import { Colors } from "../../globalConfigs";
import {
  PageContainer,
  ContentWrapper,
  PrimaryText,
  SecondaryText,
  CTAButton,
} from "./styles";

function Home() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <ContentWrapper>
        <SecondaryText delay="0s">
          Menos tempo escolhendo a{" "}
          <span style={{ color: Colors.GREEN }}>ROTA</span>,
        </SecondaryText>
        <SecondaryText delay="0.3s">
          mais tempo escolhendo O{" "}
          <span style={{ color: Colors.GREEN }}>PRATO</span>:
        </SecondaryText>
        <PrimaryText>
          Pra você aproveitar o melhor do Comida di Buteco
        </PrimaryText>
        <CTAButton onClick={() => navigate("/filters")}>
          🗺️ Começar Agora
        </CTAButton>
      </ContentWrapper>
    </PageContainer>
  );
}

export default Home;
