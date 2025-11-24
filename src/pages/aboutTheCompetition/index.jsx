import { useState, useEffect } from "react";
import {
  PageContainer,
  ContentSection,
  SidebarSection,
  SidebarTitle,
  ImageGallery,
  ImageCard,
  DishImage,
  ImageCaption,
  LogoSection,
  CompetitionLogo,
  OfficialLink,
  FixedImageCard,
  FixedLogoImage,
} from "./styles";
import competitionLogo from "../../assets/logos/competition.png";
import { dishesData } from "./dishesData";

function AboutTheCompetition() {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % dishesData.length);
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  // Pega 3 imagens consecutivas (com wrap around)
  const getVisibleImages = () => {
    const images = [];
    for (let i = 0; i < 3; i++) {
      const index = (startIndex + i) % dishesData.length;
      images.push(dishesData[index]);
    }
    return images;
  };

  const visibleImages = getVisibleImages();

  return (
    <PageContainer>
      <SidebarSection>
        <ImageGallery>
          {visibleImages.map((item, index) => (
            <ImageCard key={`${startIndex}-${index}`}>
              <DishImage src={item.image} alt={`${item.dish} - ${item.bar}`} />
              <ImageCaption>
                <strong>{item.bar}</strong>
                <br />
                {item.dish}
              </ImageCaption>
            </ImageCard>
          ))}
        </ImageGallery>
      </SidebarSection>
      <ContentSection>
        <h1>Sobre o Comida di Buteco</h1>
        <p>
          O Comida di Buteco é o maior concurso gastronômico de botecos do
          Brasil. Criado em Belo Horizonte em 2000, o evento celebra a cultura
          butequeira e a gastronomia de raiz dos botequins brasileiros.
        </p>
        <p>
          Durante o concurso, os botecos participantes criam petiscos exclusivos
          que são avaliados por um júri técnico e pelo público. Os critérios
          incluem sabor, criatividade, apresentação, preço e atendimento.
        </p>
        <p>
          A competição já alcançou diversas cidades brasileiras, valorizando não
          apenas a gastronomia, mas também a economia local e o turismo
          cultural.
        </p>

        <LogoSection>
          <CompetitionLogo src={competitionLogo} alt="Logo Comida di Buteco" />
          <OfficialLink
            href="https://www.comidadibuteco.com.br/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visite o Site Oficial
          </OfficialLink>
        </LogoSection>
      </ContentSection>
    </PageContainer>
  );
}

export default AboutTheCompetition;
