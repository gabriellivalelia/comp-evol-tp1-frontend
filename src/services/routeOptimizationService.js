const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Serviço para comunicação com a API de otimização de rotas
 */
class RouteOptimizationService {
  /**
   * Verifica se a API está funcionando
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao verificar saúde da API:", error);
      throw new Error("API não está disponível");
    }
  }

  /**
   * Retorna lista de todos os bares disponíveis
   */
  async getBars() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bars`);
      if (!response.ok) {
        throw new Error("Erro ao buscar lista de bares");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar bares:", error);
      throw error;
    }
  }

  /**
   * Otimiza a rota com base nos filtros fornecidos
   * @param {Object} filters - Filtros de otimização
   * @param {string} filters.startDate - Data de início (YYYY-MM-DD)
   * @param {string} filters.endDate - Data de fim (YYYY-MM-DD)
   * @param {string} filters.startTime - Horário de início (HH:MM)
   * @param {string} filters.endTime - Horário de término (HH:MM)
   * @param {string} filters.startPoint - Nome do bar inicial
   * @param {Array<string>} filters.daysOfWeek - Dias da semana (opcional)
   * @param {number} filters.minRating - Nota mínima (opcional)
   * @param {Array<string>} filters.menuOptions - Opções de menu (opcional)
   * @returns {Promise<Object>} Rota otimizada com bares e estatísticas
   */
  async optimizeRoute(filters) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/optimize-route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao otimizar rota");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erro desconhecido ao otimizar rota");
      }

      return data;
    } catch (error) {
      console.error("Erro ao otimizar rota:", error);
      throw error;
    }
  }

  /**
   * Busca coordenadas de um bar específico
   * @param {string} barName - Nome do bar
   */
  async getBarCoordinates(barName) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/bar-coordinates/${encodeURIComponent(barName)}`
      );

      if (!response.ok) {
        throw new Error("Bar não encontrado");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar coordenadas do bar:", error);
      throw error;
    }
  }

  /**
   * Formata os dados da API para o formato esperado pelo componente BestRoute
   * @param {Object} apiResponse - Resposta da API
   * @returns {Object} Dados formatados
   */
  formatForBestRoute(apiResponse) {
    return {
      // Lista flat de todos os bares (para compatibilidade)
      barsData: apiResponse.bars.map((bar) => ({
        id: bar.id,
        name: bar.name,
        address: bar.address,
        rating: bar.rating,
        lat: bar.lat,
        lng: bar.lng,
        arrivalTime: bar.arrivalTime,
        departureTime: bar.departureTime,
        day: bar.day,
      })),
      // Dados organizados por dia com cores
      days: apiResponse.days.map((day) => ({
        date: day.date,
        displayDate: day.displayDate,
        dayNumber: day.dayNumber,
        color: day.color,
        bars: day.bars.map((bar) => ({
          id: bar.id,
          name: bar.name,
          address: bar.address,
          rating: bar.rating,
          lat: bar.lat,
          lng: bar.lng,
          arrivalTime: bar.arrivalTime,
          departureTime: bar.departureTime,
        })),
      })),
      routeStats: {
        totalDistance: apiResponse.stats.totalDistance,
        totalDuration: apiResponse.stats.totalDuration,
        numberOfStops: apiResponse.stats.numberOfStops,
        numberOfDays: apiResponse.stats.numberOfDays,
        cost: apiResponse.stats.cost,
      },
    };
  }
}

export default new RouteOptimizationService();
