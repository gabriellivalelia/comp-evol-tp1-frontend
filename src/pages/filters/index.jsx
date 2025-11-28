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
import routeOptimizationService from "../../services/routeOptimizationService";

function Filters() {
  const navigate = useNavigate();

  // Lista de todos os bares disponíveis (getAllCoordinates retorna array de objetos)
  const allBarsData = getAllCoordinates();
  const availableBars = allBarsData.map((bar) => bar.name).sort();

  // Função para obter a data de amanhã no formato yyyy-mm-dd
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [filters, setFilters] = useState({
    startDate: getTomorrow(),
    endDate: getTomorrow(),
    startTime: "16:00",
    endTime: "20:00",
    startPoint: availableBars[0] || "", // Primeiro bar como padrão
    minRating: "4.0",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handleMuiMultiSelectChange removido

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);
    setError(null);

    // Validação de datas e horários
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    const startTime = filters.startTime;
    const endTime = filters.endTime;

    if (!startDate || !endDate) {
      setError("Por favor, preencha as datas de início e fim.");
      return;
    }
    if (startDate < today) {
      setError("A data de início não pode ser no passado.");
      return;
    }
    if (endDate < startDate) {
      setError("A data de fim não pode ser anterior à data de início.");
      return;
    }
    if (startDate.getTime() === endDate.getTime() && startTime && endTime) {
      // Se for o mesmo dia, horário de término deve ser maior que o de início
      if (endTime <= startTime) {
        setError(
          "O horário de término deve ser maior que o de início no mesmo dia."
        );
        return;
      }
    }

    setIsLoading(true);
    try {
      // Chamar API para otimizar rota
      const response = await routeOptimizationService.optimizeRoute(filters);
      const formattedData =
        routeOptimizationService.formatForBestRoute(response);
      // Navegar para a página de melhor rota com os dados otimizados
      navigate("/bestRoute", {
        state: {
          recalculate: true,
          filters,
          optimizedRoute: formattedData,
        },
      });
    } catch (err) {
      setError(err.message || "Erro ao calcular rota. Tente novamente.");
      // Ainda assim navega, mas sem dados otimizados (usará mock)
      navigate("/bestRoute", { state: { recalculate: true, filters } });
    } finally {
      setIsLoading(false);
    }
  };

  // menuOptionsAvailable removido

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
            {/* Campo de dias da semana removido */}
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
              {/* Campo de opções do menu removido */}
            </FormRow>
            <InfoBox>
              <p>
                <strong>🔍 Como funciona:</strong> O algoritmo de otimização
                levará em consideração todas as suas preferências para criar a
                melhor rota, maximizando sua experiência gastronômica!
              </p>
            </InfoBox>
          </Section>

          {/* Mensagem de erro */}
          {error && (
            <InfoBox
              style={{
                backgroundColor: "#ffe6e6",
                borderColor: "#ff4444",
                marginTop: "1rem",
              }}
            >
              <p>
                <strong>❌ Erro:</strong> {error}
              </p>
            </InfoBox>
          )}

          {/* Botão de envio */}
          <ButtonContainer>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading
                ? "⏳ Calculando melhor rota..."
                : "🚀 Encontrar Melhor Rota"}
            </SubmitButton>
          </ButtonContainer>
        </form>
      </FormContainer>
    </PageContainer>
  );
}

export default Filters;
