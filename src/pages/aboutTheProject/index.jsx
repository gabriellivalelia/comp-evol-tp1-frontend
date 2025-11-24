import {
  PageContainer,
  SidebarSection,
  SidebarTitle,
  TeamList,
  TeamMember,
  MemberPhoto,
  MemberInfo,
  MemberName,
  MemberBio,
  ContentSection,
  PageTitle,
  ContentText,
} from "./styles";

// Importando as fotos dos membros da equipe
import gabrielliPhoto from "../../assets/profilesPictures/gabrielli.png";
import gabrielPhoto from "../../assets/profilesPictures/gabriel.png";
import juliaPhoto from "../../assets/profilesPictures/julia.png";
import gabrielaPhoto from "../../assets/profilesPictures/gabriela.png";

function AboutTheProject() {
  const teamMembers = [
    {
      name: "GABRIELLI VALELIA",
      bio: "Estudante de Engenharia Elétrica da UFMG.",
      photo: gabrielliPhoto,
    },
    {
      name: "GABRIEL ARAÚJO",
      bio: "Estudante de Engenharia Elétrica da UFMG.",
      photo: gabrielPhoto,
    },
    {
      name: "JULIA DINIZ",
      bio: "Estudante de Engenharia de Controle e Automação da UFMG.",
      photo: juliaPhoto,
    },
    {
      name: "GABRIELA NUNES",
      bio: "Professora na área de inteligência computacional na UFMG. Doutora em Engenharia Elétrica na Universidade de São Paulo (USP).",
      photo: gabrielaPhoto,
    },
  ];

  return (
    <PageContainer>
      <SidebarSection>
        <SidebarTitle>SOBRE NÓS</SidebarTitle>
        <TeamList>
          {teamMembers.map((member, index) => (
            <TeamMember key={index}>
              <MemberPhoto>
                {member.photo ? (
                  <img src={member.photo} alt={member.name} />
                ) : (
                  <span>👤</span>
                )}
              </MemberPhoto>
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberBio>{member.bio}</MemberBio>
              </MemberInfo>
            </TeamMember>
          ))}
        </TeamList>
      </SidebarSection>

      <ContentSection>
        <PageTitle>ELE083 - Computação Evolucionária</PageTitle>
        <ContentText>
          A disciplina de Computação Evolucionária aborda técnicas de otimização
          inspiradas em processos evolutivos naturais, como algoritmos
          genéticos e otimização
          por enxame de partículas. O objetivo é capacitar os alunos a aplicar
          esses métodos na resolução de problemas complexos de otimização que
          não possuem soluções analíticas triviais.
        </ContentText>
        <ContentText>
          <strong>Proposta do Trabalho Prático:</strong> Este projeto implementa
          uma solução para o{" "}
          <strong>Problema do Caixeiro Viajante (TSP)</strong> aplicado ao
          contexto real dos bares de Belo Horizonte participantes do Comida di
          Buteco. O desafio consiste em encontrar a rota mais eficiente
          para visitar um conjunto de bares a partir de filtros como avaliação do bar e horário de funcionamento, minimizando o tempo gasto no tour gastronômico.
        </ContentText>
        <ContentText>
          Utilizamos <strong>Tabu Search</strong> como meta-heurística
          principal. A interface web permite que
          usuários selecionem os filtros desejados e visualizem em tempo real a
          melhor rota calculada, com marcadores interativos no mapa.
        </ContentText>
      </ContentSection>
    </PageContainer>
  );
}

export default AboutTheProject;
