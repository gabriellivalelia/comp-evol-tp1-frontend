import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  PageContainer,
  Sidebar,
  SidebarHeader,
  PageTitle,
  RouteInfo,
  InfoRow,
  BarList,
  BarCard,
  BarNumber,
  BarInfo,
  BarName,
  BarAddress,
  BarRating,
  MapContainer,
  LoadingOverlay,
  LoadingText,
  ExportButton,
} from "./styles";
import { getBarCoordinates } from "../../data/barCoordinates";

// Função helper para obter coordenadas com fallback
const getBarsWithCoordinates = (barNames) => {
  return barNames.map((name, index) => {
    const coords = getBarCoordinates(name);
    return {
      id: index + 1,
      name: name,
      address: coords?.address || `${name}, Belo Horizonte - MG`,
      rating: 4.5, // Você pode adicionar isso nos dados reais
      lat: coords?.lat || -19.9167,
      lng: coords?.lng || -43.9345,
    };
  });
};

// Lista de bares para a rota (substitua pelos bares selecionados pelo usuário)
const selectedBarNames = [
  "Alexandre's Bar",
  "Amarelim do Prado",
  "Bar do Alexandre",
  "Empório Santa Tereza",
];

// Obtém coordenadas do arquivo local (SEM chamadas à API de geocoding!)
const mockBarsData = getBarsWithCoordinates(selectedBarNames);

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -19.9356,
  lng: -43.935,
};

function BestRoute() {
  const location = useLocation();
  const shouldRecalculate = location.state?.recalculate || false;

  // Tentar recuperar estado do cache ao inicializar
  const getCachedState = () => {
    // Se veio da página de filtros, não usar cache
    if (shouldRecalculate) {
      return null;
    }

    try {
      const cached = sessionStorage.getItem("bestRouteState");
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Erro ao recuperar cache:", error);
      return null;
    }
  };

  const cachedState = getCachedState();

  const [selectedBar, setSelectedBar] = useState(
    cachedState?.selectedBar || null
  );
  const [directions, setDirections] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routeStats, setRouteStats] = useState(
    cachedState?.routeStats || {
      totalDistance: "0 km",
      totalDuration: "0 min",
      numberOfStops: mockBarsData.length,
    }
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Limpar flag de recalcular após o cálculo
  useEffect(() => {
    if (shouldRecalculate && isMapLoaded) {
      // Limpar o estado de navegação para não recalcular novamente
      window.history.replaceState({}, document.title);
    }
  }, [shouldRecalculate, isMapLoaded]);

  // Salvar estado no cache sempre que houver mudanças
  useEffect(() => {
    if (routeStats.totalDistance !== "0 km") {
      const stateToCache = {
        selectedBar,
        routeStats,
        timestamp: Date.now(),
      };
      sessionStorage.setItem("bestRouteState", JSON.stringify(stateToCache));
    }
  }, [selectedBar, routeStats]);

  // Configurar a rota quando o componente carregar
  const onMapLoad = useCallback(() => {
    // Se veio da página de filtros, sempre recalcular
    if (!shouldRecalculate) {
      // Se já carregou antes e temos cache, não recarregar
      if (isMapLoaded || cachedState?.routeStats?.totalDistance !== "0 km") {
        setIsMapLoaded(true);
        return;
      }
    }

    setIsLoading(true);
    setIsMapLoaded(true);

    // Criar waypoints (pontos intermediários)
    const waypoints = mockBarsData.slice(1, -1).map((bar) => ({
      location: { lat: bar.lat, lng: bar.lng },
      stopover: true,
    }));

    // Solicitar direções
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: mockBarsData[0].lat, lng: mockBarsData[0].lng },
        destination: {
          lat: mockBarsData[mockBarsData.length - 1].lat,
          lng: mockBarsData[mockBarsData.length - 1].lng,
        },
        waypoints: waypoints,
        optimizeWaypoints: false, // Já recebemos a ordem otimizada da API
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          // Calcular estatísticas da rota
          const route = result.routes[0];
          let totalDistance = 0;
          let totalDuration = 0;

          route.legs.forEach((leg) => {
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;
          });

          setRouteStats({
            totalDistance: `${(totalDistance / 1000).toFixed(1)} km`,
            totalDuration: `${Math.round(totalDuration / 60)} min`,
            numberOfStops: mockBarsData.length,
          });
        } else {
          console.error(`Erro ao calcular rota: ${status}`);
        }
        setIsLoading(false);
      }
    );
  }, [isMapLoaded, cachedState?.routeStats?.totalDistance, shouldRecalculate]);

  const handleExportRoute = () => {
    // Exportar rota (PDF, compartilhar, etc)
    const routeText = mockBarsData
      .map((bar, index) => `${index + 1}. ${bar.name}\n   ${bar.address}`)
      .join("\n\n");

    const blob = new Blob([routeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rota-comida-di-buteco.txt";
    link.click();
  };

  // Função para limpar cache (descomente o botão na interface para usar)
  // eslint-disable-next-line no-unused-vars
  const handleClearCache = () => {
    sessionStorage.removeItem("bestRouteState");
    window.location.reload();
  };

  return (
    <PageContainer>
      <Sidebar>
        <SidebarHeader>
          <PageTitle>🗺️ Sua Melhor Rota</PageTitle>
        </SidebarHeader>

        <RouteInfo>
          <InfoRow>
            <span>📍 Paradas:</span>
            <span>{routeStats.numberOfStops} bares</span>
          </InfoRow>
          <InfoRow>
            <span>📏 Distância Total:</span>
            <span>{routeStats.totalDistance}</span>
          </InfoRow>
        </RouteInfo>

        <BarList>
          {mockBarsData.map((bar, index) => (
            <BarCard
              key={bar.id}
              isActive={selectedBar === bar.id}
              delay={`${index * 0.1}s`}
              onClick={() => setSelectedBar(bar.id)}
            >
              <BarNumber isActive={selectedBar === bar.id}>
                {index + 1}
              </BarNumber>
              <BarInfo>
                <BarName isActive={selectedBar === bar.id}>{bar.name}</BarName>
                <BarAddress isActive={selectedBar === bar.id}>
                  {bar.address}
                </BarAddress>
                <BarRating isActive={selectedBar === bar.id}>
                  ⭐ {bar.rating.toFixed(1)}
                </BarRating>
              </BarInfo>
            </BarCard>
          ))}
        </BarList>

        <ExportButton onClick={handleExportRoute}>
          📥 Exportar Roteiro
        </ExportButton>
        {/* Descomentar se precisar de um botão para limpar cache:
        <ExportButton onClick={handleClearCache} style={{ marginTop: '10px', backgroundColor: '#888' }}>
          🗑️ Limpar Cache
        </ExportButton>
        */}
      </Sidebar>

      <MapContainer>
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
          loadingElement={<LoadingText>🗺️ Carregando mapa...</LoadingText>}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            onLoad={onMapLoad}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {/* Marcadores numerados */}
            {mockBarsData.map((bar, index) => (
              <Marker
                key={bar.id}
                position={{ lat: bar.lat, lng: bar.lng }}
                label={{
                  text: `${index + 1}`,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
                onClick={() => setSelectedBar(bar.id)}
                animation={
                  selectedBar === bar.id && window.google?.maps?.Animation
                    ? window.google.maps.Animation.BOUNCE
                    : null
                }
              />
            ))}

            {/* Renderizar a rota */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true, // Usamos nossos próprios marcadores
                  polylineOptions: {
                    strokeColor: "#FF6B35",
                    strokeWeight: 5,
                    strokeOpacity: 0.8,
                  },
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>

        {isLoading && (
          <LoadingOverlay>
            <LoadingText>🗺️ Calculando a melhor rota...</LoadingText>
            <div>⏳</div>
          </LoadingOverlay>
        )}
      </MapContainer>
    </PageContainer>
  );
}

export default BestRoute;
