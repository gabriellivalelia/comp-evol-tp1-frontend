// Utilitário para gerenciar coordenadas com cache no LocalStorage
// Isso evita chamadas repetidas à API de geocoding

const STORAGE_KEY = "comidaDiButeco_barCoordinates";
const CACHE_EXPIRY_DAYS = 30; // Coordenadas expiram após 30 dias

/**
 * Salva coordenadas no LocalStorage
 * @param {string} barName - Nome do bar
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} address - Endereço completo (opcional)
 */
export const saveCoordinates = (barName, lat, lng, address = "") => {
  try {
    const cache = getCache();
    cache[barName] = {
      lat,
      lng,
      address,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    console.log(`✅ Coordenadas salvas para: ${barName}`);
  } catch (error) {
    console.error(`❌ Erro ao salvar coordenadas para ${barName}:`, error);
  }
};

/**
 * Obtém coordenadas do LocalStorage
 * @param {string} barName - Nome do bar
 * @returns {Object|null} Coordenadas ou null se não encontradas/expiradas
 */
export const getCoordinates = (barName) => {
  try {
    const cache = getCache();
    const data = cache[barName];

    if (!data) {
      return null;
    }

    // Verifica se o cache expirou
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - data.timestamp > expiryTime;

    if (isExpired) {
      console.log(`⏰ Cache expirado para: ${barName}`);
      deleteCoordinates(barName);
      return null;
    }

    return {
      lat: data.lat,
      lng: data.lng,
      address: data.address,
    };
  } catch (error) {
    console.error(`❌ Erro ao obter coordenadas para ${barName}:`, error);
    return null;
  }
};

/**
 * Obtém todas as coordenadas do cache
 * @returns {Object} Objeto com todas as coordenadas em cache
 */
export const getAllCachedCoordinates = () => {
  return getCache();
};

/**
 * Deleta coordenadas específicas do cache
 * @param {string} barName - Nome do bar
 */
export const deleteCoordinates = (barName) => {
  try {
    const cache = getCache();
    delete cache[barName];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    console.log(`🗑️ Coordenadas deletadas para: ${barName}`);
  } catch (error) {
    console.error(`❌ Erro ao deletar coordenadas para ${barName}:`, error);
  }
};

/**
 * Limpa todo o cache de coordenadas
 */
export const clearCache = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("🗑️ Cache de coordenadas limpo completamente");
  } catch (error) {
    console.error("❌ Erro ao limpar cache:", error);
  }
};

/**
 * Exporta todas as coordenadas em cache para JSON
 * @returns {string} JSON string com todas as coordenadas
 */
export const exportCache = () => {
  const cache = getCache();
  return JSON.stringify(cache, null, 2);
};

/**
 * Importa coordenadas de um JSON
 * @param {string} jsonString - JSON string com coordenadas
 */
export const importCache = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log("✅ Cache importado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao importar cache:", error);
  }
};

/**
 * Obtém estatísticas do cache
 * @returns {Object} Estatísticas do cache
 */
export const getCacheStats = () => {
  const cache = getCache();
  const entries = Object.entries(cache);

  return {
    totalBars: entries.length,
    oldestEntry: entries.reduce((oldest, [name, data]) => {
      return !oldest || data.timestamp < oldest.timestamp
        ? { name, timestamp: data.timestamp }
        : oldest;
    }, null),
    newestEntry: entries.reduce((newest, [name, data]) => {
      return !newest || data.timestamp > newest.timestamp
        ? { name, timestamp: data.timestamp }
        : newest;
    }, null),
    cacheSize: new Blob([JSON.stringify(cache)]).size,
  };
};

// Função privada para obter o cache completo
function getCache() {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error("❌ Erro ao ler cache:", error);
    return {};
  }
}

/**
 * Hook personalizado para usar coordenadas com cache
 * @param {string} barName - Nome do bar
 * @param {Function} fetchCoordinates - Função async para buscar coordenadas da API
 * @returns {Object} { coordinates, loading, error }
 */
export const useCoordinatesWithCache = async (barName, fetchCoordinates) => {
  // Tenta obter do cache primeiro
  let coordinates = getCoordinates(barName);

  if (coordinates) {
    console.log(`📍 Coordenadas obtidas do cache para: ${barName}`);
    return { coordinates, loading: false, error: null };
  }

  // Se não estiver em cache, busca da API
  try {
    console.log(`🌐 Buscando coordenadas da API para: ${barName}`);
    coordinates = await fetchCoordinates(barName);

    if (coordinates && coordinates.lat && coordinates.lng) {
      // Salva no cache
      saveCoordinates(
        barName,
        coordinates.lat,
        coordinates.lng,
        coordinates.address
      );
      return { coordinates, loading: false, error: null };
    }

    throw new Error("Coordenadas inválidas retornadas pela API");
  } catch (error) {
    console.error(`❌ Erro ao buscar coordenadas para ${barName}:`, error);
    return { coordinates: null, loading: false, error: error.message };
  }
};
