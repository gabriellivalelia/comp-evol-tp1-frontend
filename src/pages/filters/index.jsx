import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  Select as MuiSelect,
  MenuItem,
  Chip,
  Box,
  OutlinedInput,
} from "@mui/material";
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  FormContainer,
  Section,
  SectionHeader,
  SectionNumber,
  SectionTitle,
  FormRow,
  FormGroup,
  Label,
  LabelIcon,
  Input,
  Select,
  TimeInputWrapper,
  IconButton,
  SubmitButton,
  ButtonContainer,
  InfoBox,
} from "./styles";
import { getAllCoordinates } from "../../data/barCoordinates";

function Filters() {
  const navigate = useNavigate();

  // Lista de todos os bares disponíveis (getAllCoordinates retorna array de objetos)
  const allBarsData = getAllCoordinates();
  const availableBars = allBarsData.map((bar) => bar.name).sort();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    daysOfWeek: [],
    startTime: "16:00",
    endTime: "23:00",
    startPoint: availableBars[0] || "", // Primeiro bar como padrão
    minRating: "4.0",
    menuOptions: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMuiMultiSelectChange = (name) => (event) => {
    const {
      target: { value },
    } = event;
    setFilters((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Filtros selecionados:", filters);
    // Navegar para a página de melhor rota com flag para recalcular
    navigate("/bestRoute", { state: { recalculate: true, filters } });
  };

  // Opções de menu disponíveis
  const menuOptionsAvailable = [
    "Frango",
    "Carne",
    "Peixe",
    "Porco",
    "Vegetariano",
    "Vegano",
    "Petiscos Tradicionais",
    "Massas",
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>🗺️ Planeje Seu Tour Gastronômico</PageTitle>
        <PageSubtitle>
          Configure suas preferências e encontre a melhor rota pelos melhores
          botecos de BH
        </PageSubtitle>
      </PageHeader>

      <FormContainer>
        <form onSubmit={handleSubmit}>
          {/* Seção 1: Período */}
          <Section>
            <SectionHeader>
              <SectionNumber>1</SectionNumber>
              <SectionTitle>Período em que deseja fazer o tour</SectionTitle>
            </SectionHeader>
            <FormRow>
              <FormGroup>
                <Label>
                  <LabelIcon>📅</LabelIcon>
                  Data de início
                </Label>
                <Input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleChange}
                  placeholder="25/10/2025"
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  <LabelIcon>📅</LabelIcon>
                  Data de fim
                </Label>
                <Input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleChange}
                  placeholder="25/11/2025"
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <Label>
                  <LabelIcon>⏰</LabelIcon>
                  Horário de início
                </Label>
                <TimeInputWrapper>
                  <Input
                    type="time"
                    name="startTime"
                    value={filters.startTime}
                    onChange={handleChange}
                  />
                  <IconButton type="button">🕐</IconButton>
                </TimeInputWrapper>
              </FormGroup>
              <FormGroup>
                <Label>
                  <LabelIcon>⏰</LabelIcon>
                  Horário de término
                </Label>
                <TimeInputWrapper>
                  <Input
                    type="time"
                    name="endTime"
                    value={filters.endTime}
                    onChange={handleChange}
                  />
                  <IconButton type="button">🕐</IconButton>
                </TimeInputWrapper>
              </FormGroup>
            </FormRow>
            <InfoBox>
              <p>
                <strong>⏰ Atenção:</strong> O horário de início e término será
                considerado para <strong>todos os dias</strong> do seu tour
                gastronômico.
              </p>
            </InfoBox>
            <FormRow columns="1fr">
              <FormGroup>
                <Label>
                  <LabelIcon>📆</LabelIcon>
                  Dias da semana
                </Label>
                <FormControl fullWidth>
                  <MuiSelect
                    multiple
                    value={filters.daysOfWeek}
                    onChange={handleMuiMultiSelectChange("daysOfWeek")}
                    input={<OutlinedInput />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            sx={{
                              backgroundColor: "#FF6B35",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="Segunda">Segunda-feira</MenuItem>
                    <MenuItem value="Terça">Terça-feira</MenuItem>
                    <MenuItem value="Quarta">Quarta-feira</MenuItem>
                    <MenuItem value="Quinta">Quinta-feira</MenuItem>
                    <MenuItem value="Sexta">Sexta-feira</MenuItem>
                    <MenuItem value="Sábado">Sábado</MenuItem>
                    <MenuItem value="Domingo">Domingo</MenuItem>
                  </MuiSelect>
                </FormControl>
                <InfoBox>
                  <p>
                    <strong>📅 Atenção:</strong> Os dias da semana selecionados
                    representam quais dias da semana,{" "}
                    <strong>dentro do intervalo de datas escolhido</strong>,
                    você deseja fazer o tour. Por exemplo, se você selecionar
                    Segunda e Quarta, o tour será planejado apenas para essas
                    duas segundas e quartas dentro do período escolhido.
                  </p>
                </InfoBox>
              </FormGroup>
            </FormRow>
          </Section>

          {/* Seção 2: Roteiro */}
          <Section>
            <SectionHeader>
              <SectionNumber>2</SectionNumber>
              <SectionTitle>Roteiro</SectionTitle>
            </SectionHeader>
            <FormRow columns="1fr">
              <FormGroup>
                <Label>
                  <LabelIcon>📍</LabelIcon>
                  Ponto inicial (Bar de partida)
                </Label>
                <Select
                  name="startPoint"
                  value={filters.startPoint}
                  onChange={handleChange}
                >
                  {availableBars.map((bar, index) => (
                    <option key={index} value={bar}>
                      {bar}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>
            <InfoBox style={{ marginTop: "1rem" }}>
              <p>
                <strong>💰 Informação Importante:</strong> Cada prato da
                competição Comida di Buteco tem um custo fixo de{" "}
                <strong>R$ 35,00</strong>.
              </p>
            </InfoBox>
          </Section>

          {/* Seção 3: Preferências */}
          <Section last>
            <SectionHeader>
              <SectionNumber>3</SectionNumber>
              <SectionTitle>Preferências</SectionTitle>
            </SectionHeader>
            <FormRow>
              <FormGroup>
                <Label>
                  <LabelIcon>⭐</LabelIcon>
                  Nota mínima
                </Label>
                <Select
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleChange}
                >
                  <option value="3.0">⭐ 3.0 - Bom</option>
                  <option value="3.5">⭐ 3.5 - Bom+</option>
                  <option value="4.0">⭐ 4.0 - Muito Bom</option>
                  <option value="4.5">⭐ 4.5 - Excelente</option>
                  <option value="5.0">⭐ 5.0 - Perfeito</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>
                  <LabelIcon>🍴</LabelIcon>
                  Opções do menu
                </Label>
                <FormControl fullWidth>
                  <MuiSelect
                    multiple
                    value={filters.menuOptions}
                    onChange={handleMuiMultiSelectChange("menuOptions")}
                    input={<OutlinedInput />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            sx={{
                              backgroundColor: "#FF6B35",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {menuOptionsAvailable.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </FormGroup>
            </FormRow>
            <InfoBox>
              <p>
                <strong>🔍 Como funciona:</strong> O algoritmo de otimização
                levará em consideração todas as suas preferências para criar a
                melhor rota, maximizando sua experiência gastronômica!
              </p>
            </InfoBox>
          </Section>

          {/* Botão de envio */}
          <ButtonContainer>
            <SubmitButton type="submit">🚀 Encontrar Melhor Rota</SubmitButton>
          </ButtonContainer>
        </form>
      </FormContainer>
    </PageContainer>
  );
}

export default Filters;
