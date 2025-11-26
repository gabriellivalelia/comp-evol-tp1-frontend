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
  const optimizedRoute = location.state?.optimizedRoute || null;

  // Usar dados otimizados da API se disponíveis
  const barsDataToUse = optimizedRoute?.barsData
    ? optimizedRoute.barsData
    : mockBarsData;

  // Dados organizados por dia (se disponível)
  const daysByDate = optimizedRoute?.days || null;

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
  const [directionsPerDay, setDirectionsPerDay] = useState([]); // Array de direções, uma por dia
  const [isLoading, setIsLoading] = useState(false);
  const [routeStats, setRouteStats] = useState(
    optimizedRoute?.routeStats ||
      cachedState?.routeStats || {
        totalDistance: "0 km",
        totalDuration: "0 min",
        numberOfStops: barsDataToUse.length,
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

    const directionsService = new window.google.maps.DirectionsService();

    // Se temos dados organizados por dia, calcular rotas separadas
    if (daysByDate && daysByDate.length > 0) {
      const directionsPromises = daysByDate.map((day) => {
        const dayBars = day.bars;

        if (dayBars.length === 1) {
          // Apenas um bar neste dia, não precisa de rota
          return Promise.resolve({
            color: day.color,
            directions: null,
            singleBar: dayBars[0],
          });
        }

        const waypoints = dayBars.slice(1, -1).map((bar) => ({
          location: { lat: bar.lat, lng: bar.lng },
          stopover: true,
        }));

        return new Promise((resolve) => {
          directionsService.route(
            {
              origin: { lat: dayBars[0].lat, lng: dayBars[0].lng },
              destination: {
                lat: dayBars[dayBars.length - 1].lat,
                lng: dayBars[dayBars.length - 1].lng,
              },
              waypoints: waypoints,
              optimizeWaypoints: false,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                resolve({
                  color: day.color,
                  directions: result,
                  singleBar: null,
                });
              } else {
                console.error(
                  `Erro ao calcular rota do dia ${day.displayDate}: ${status}`
                );
                resolve({
                  color: day.color,
                  directions: null,
                  singleBar: null,
                });
              }
            }
          );
        });
      });

      Promise.all(directionsPromises).then((results) => {
        setDirectionsPerDay(results);

        // Sempre calcular distância e duração real do Google Maps
        let totalDistance = 0;
        let totalDuration = 0;

        results.forEach((dayRoute) => {
          if (dayRoute.directions) {
            const route = dayRoute.directions.routes[0];
            route.legs.forEach((leg) => {
              totalDistance += leg.distance.value;
              totalDuration += leg.duration.value;
            });
          }
        });

        // Atualizar stats com valores reais do Google Maps
        setRouteStats({
          totalDistance: `${(totalDistance / 1000).toFixed(1)} km`,
          totalDuration: `${Math.round(totalDuration / 60)} min`,
          numberOfStops:
            optimizedRoute?.routeStats?.numberOfStops || barsDataToUse.length,
          numberOfDays: daysByDate.length,
          cost: optimizedRoute?.routeStats?.cost,
        });

        setIsLoading(false);
      });
    } else {
      // Fallback: rota única (modo antigo)
      const waypoints = barsDataToUse.slice(1, -1).map((bar) => ({
        location: { lat: bar.lat, lng: bar.lng },
        stopover: true,
      }));

      directionsService.route(
        {
          origin: { lat: barsDataToUse[0].lat, lng: barsDataToUse[0].lng },
          destination: {
            lat: barsDataToUse[barsDataToUse.length - 1].lat,
            lng: barsDataToUse[barsDataToUse.length - 1].lng,
          },
          waypoints: waypoints,
          optimizeWaypoints: false,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);

            // Sempre calcular distância e duração real do Google Maps
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
              numberOfStops:
                optimizedRoute?.routeStats?.numberOfStops ||
                barsDataToUse.length,
              cost: optimizedRoute?.routeStats?.cost,
            });
          } else {
            console.error(`Erro ao calcular rota: ${status}`);
          }
          setIsLoading(false);
        }
      );
    }
  }, [
    isMapLoaded,
    cachedState?.routeStats?.totalDistance,
    shouldRecalculate,
    barsDataToUse,
    optimizedRoute?.routeStats,
    daysByDate,
  ]);

  const handleExportRoute = () => {
    // Exportar rota (PDF, compartilhar, etc)
    const routeText = barsDataToUse
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
          {routeStats.numberOfDays && (
            <InfoRow>
              <span>📅 Dias:</span>
              <span>
                {routeStats.numberOfDays}{" "}
                {routeStats.numberOfDays === 1 ? "dia" : "dias"}
              </span>
            </InfoRow>
          )}
          <InfoRow>
            <span>📏 Distância Total:</span>
            <span>{routeStats.totalDistance}</span>
          </InfoRow>
        </RouteInfo>

        <BarList>
          {daysByDate && daysByDate.length > 0
            ? // Modo com dias separados
              daysByDate.map((day, dayIndex) => (
                <div key={day.date}>
                  <div
                    style={{
                      padding: "12px 16px",
                      backgroundColor: day.color,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      marginTop: dayIndex > 0 ? "20px" : "0",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    📅 Dia {day.dayNumber} - {day.displayDate}
                    <div
                      style={{
                        fontSize: "0.85rem",
                        marginTop: "4px",
                        opacity: 0.9,
                      }}
                    >
                      {day.bars.length}{" "}
                      {day.bars.length === 1 ? "bar" : "bares"}
                    </div>
                  </div>
                  {day.bars.map((bar, barIndex) => (
                    <BarCard
                      key={bar.id}
                      isActive={selectedBar === bar.id}
                      delay={`${(dayIndex * 10 + barIndex) * 0.1}s`}
                      onClick={() => setSelectedBar(bar.id)}
                      style={{ borderLeft: `4px solid ${day.color}` }}
                    >
                      <BarNumber
                        isActive={selectedBar === bar.id}
                        style={{ backgroundColor: day.color }}
                      >
                        {barIndex + 1}
                      </BarNumber>
                      <BarInfo>
                        <BarName isActive={selectedBar === bar.id}>
                          {bar.name}
                        </BarName>
                        <BarAddress isActive={selectedBar === bar.id}>
                          {bar.address}
                        </BarAddress>
                        <BarRating isActive={selectedBar === bar.id}>
                          ⭐ {bar.rating.toFixed(1)} • 🕐 {bar.arrivalTime}
                        </BarRating>
                      </BarInfo>
                    </BarCard>
                  ))}
                </div>
              ))
            : // Fallback: lista simples (modo antigo)
              barsDataToUse.map((bar, index) => (
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
                    <BarName isActive={selectedBar === bar.id}>
                      {bar.name}
                    </BarName>
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
            {window.google?.maps && daysByDate && daysByDate.length > 0
              ? // Marcadores com cores por dia
                daysByDate.map((day) =>
                  day.bars.map((bar, barIndex) => (
                    <Marker
                      key={bar.id}
                      position={{ lat: bar.lat, lng: bar.lng }}
                      label={{
                        text: `${barIndex + 1}`,
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 12,
                        fillColor: day.color,
                        fillOpacity: 1,
                        strokeColor: "white",
                        strokeWeight: 2,
                        labelOrigin: new window.google.maps.Point(0, 0),
                      }}
                      onClick={() => setSelectedBar(bar.id)}
                      animation={
                        selectedBar === bar.id && window.google.maps.Animation
                          ? window.google.maps.Animation.BOUNCE
                          : null
                      }
                    />
                  ))
                )
              : window.google?.maps
              ? // Marcadores simples (modo antigo)
                barsDataToUse.map((bar, index) => (
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
                      selectedBar === bar.id && window.google.maps.Animation
                        ? window.google.maps.Animation.BOUNCE
                        : null
                    }
                  />
                ))
              : null}

            {/* Renderizar rotas por dia com cores diferentes */}
            {directionsPerDay && directionsPerDay.length > 0
              ? directionsPerDay.map((dayRoute, index) =>
                  dayRoute.directions ? (
                    <DirectionsRenderer
                      key={`day-${index}`}
                      directions={dayRoute.directions}
                      options={{
                        suppressMarkers: true,
                        polylineOptions: {
                          strokeColor: dayRoute.color,
                          strokeWeight: 5,
                          strokeOpacity: 0.8,
                        },
                      }}
                    />
                  ) : null
                )
              : // Fallback: rota única (modo antigo)
                directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      suppressMarkers: true,
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
