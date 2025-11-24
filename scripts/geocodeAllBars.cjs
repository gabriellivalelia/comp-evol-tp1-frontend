#!/usr/bin/env node

/**
 * Script Node.js para geocodificar todos os bares (versão CommonJS)
 * Execute: node scripts/geocodeAllBars.cjs
 *
 * NÃO requer instalação adicional - usa apenas módulos nativos do Node.js
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Função para carregar variáveis do .env
function loadEnv() {
  try {
    const envPath = path.join(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      envContent.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const [key, ...valueParts] = trimmed.split("=");
          const value = valueParts.join("=").trim();
          if (key && value) {
            process.env[key] = value;
          }
        }
      });
      console.log("✅ Arquivo .env carregado com sucesso!");
      return true;
    }
    return false;
  } catch (error) {
    console.warn(
      "⚠️  Não foi possível carregar o arquivo .env:",
      error.message
    );
    return false;
  }
}

// Carrega o .env
loadEnv();

// Coloque sua API Key aqui ou use variável de ambiente
const GOOGLE_MAPS_API_KEY =
  process.env.VITE_GOOGLE_MAPS_API_KEY || "SUA_API_KEY_AQUI";

// Lista de bares (extraída de dishesData.js)
const bares = [
  "Alexandre's Bar",
  "Amarelim do Prado",
  "America Norte e Sul",
  "Andrade's Beer",
  "Arcos",
  "Armazém Santa Amélia",
  "Avalanche",
  "Azougue",
  "Baiuca",
  "Bar Bambu",
  "Bar da Cinthia",
  "Bar da Fia",
  "Bar da Lu",
  "Bar da Silvania",
  "Bar do Bartolomeu",
  "Bar do Bem",
  "Bar do Joãozinho",
  "Bar do Kim",
  "Bar do Nelson",
  "Bar do Regis",
  "Bar do Romeu",
  "Bar dos Amigos",
  "Bar dos Meninos",
  "Bar Dudu",
  "Bar Estabelecimento",
  "Bar Junto Juntinho",
  "Barrigudinha",
  "Bar Stella",
  "Bazim",
  "Beco Restaurante",
  "Bendita Baderna",
  "Benjamin",
  "Boteco 86",
  "Botequim Buritis",
  "Buteco do Lili",
  "Buteco do Rod",
  "Buteco's Bar",
  "Buteco To de Boa",
  "Butequim Lourdes",
  "Butequim Onceta",
  "Café Bahia",
  "Café Palhares",
  "Camisola",
  "Canela Amarela",
  "Cantina Arte Quinta",
  "Cantinho da Baiana",
  "Casa da Madrinha",
  "Cervejaria Pajé",
  "Chapa Mágica",
  "Chopp da Esquina",
  "Companhia do Dino",
  "Conectados Bar",
  "Cosmos",
  "Deck Boi na Brasa",
  "Dona Dora",
  "Dona Ju Gastro",
  "Dona Suíça",
  "Em Beer",
  "Espetinho do Boi",
  "Espetinho do Paulão",
  "Espettinho.com",
  "Fogão de Minas",
  "Garagge Vintage",
  "Geraldim da Cida",
  "Golden Grill",
  "Iracema",
  "Ivo Grill",
  "Jato Inno",
  "Jorge Americano",
  "Juzé",
  "Kobe's",
  "Koqueiros",
  "La Elé",
  "Léo da Quadra",
  "Locomotivas Bar",
  "Magnífico Quinta",
  "Magrelos",
  "Mamute",
  "Mania Mineira",
  "Marina's",
  "Mineiros Beer",
  "Mulão",
  "Nono's Petim",
  "O Fino do Alho",
  "Oratório Bar",
  "O Rei do Peixe",
  "Parada 1095",
  "Parada do Sabor",
  "Pé de Cana",
  "Pé de Goiaba",
  "Planeta Lúpulo",
  "Poize",
  "Pompeu",
  "Prado Beer",
  "Primo",
  "Prosa Boa",
  "Quinteiro Bar",
  "Quioxque",
  "Quitanda Tia Nice",
  "Rancho do Manoel",
  "Recanto Vovó Tela",
  "Regis Bar",
  "Resenha da Naty",
  "Rest. Bom Sabor",
  "Santa Boemia",
  "Santuário Retrô",
  "Seu Braz",
  "Silvio's Bar",
  "Sinhá e Rozitha",
  "Só Bar",
  "SOS Pub",
  "S.Petim",
  "Tanganica",
  "Temático",
  "The Butcher",
  "Toca do Ogro",
  "Toninho Alto Forno",
  "Tropeiro Lisboa",
  "Us Motoca",
  "Xam Bar",
  "Xico da Cafua",
  "Xico do Churrasco",
  "Zé Bolacha",
  "Zoo Bar",
];

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error("Erro ao parsear JSON: " + error.message));
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${GOOGLE_MAPS_API_KEY}`;

  const data = await httpsGet(url);

  if (data.status === "OK" && data.results.length > 0) {
    const result = data.results[0];
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      address: result.formatted_address,
    };
  } else {
    throw new Error(`Geocoding falhou: ${data.status}`);
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocodeAllBars() {
  console.log("🚀 Iniciando geocoding de todos os bares...");
  console.log(`Total: ${bares.length} bares\n`);

  const results = {};
  const errors = [];

  for (let i = 0; i < bares.length; i++) {
    const barName = bares[i];
    const query = `${barName}, Belo Horizonte, MG, Brasil`;

    try {
      console.log(`[${i + 1}/${bares.length}] 🔍 ${barName}`);

      const coords = await geocodeAddress(query);

      results[barName] = {
        lat: coords.lat,
        lng: coords.lng,
        address: coords.address,
      };

      console.log(
        `  ✅ Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)}`
      );

      // Aguarda 250ms entre requisições para respeitar rate limits
      await sleep(250);
    } catch (error) {
      console.error(`  ❌ Erro: ${error.message}`);
      errors.push({ name: barName, error: error.message });
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Geocoding concluído!");
  console.log(`Sucesso: ${Object.keys(results).length}/${bares.length}`);
  console.log(`Erros: ${errors.length}`);

  if (errors.length > 0) {
    console.log("\n❌ Bares com erro:");
    errors.forEach((e) => console.log(`  - ${e.name}: ${e.error}`));
  }

  // Salva em arquivo
  const outputPath = path.join(
    __dirname,
    "../src/data/barCoordinates_generated.js"
  );
  const fileContent = generateFileContent(results);

  fs.writeFileSync(outputPath, fileContent, "utf8");
  console.log(`\n💾 Arquivo salvo em: ${outputPath}`);
  console.log(
    "📋 Agora execute: cp src/data/barCoordinates_generated.js src/data/barCoordinates.js"
  );

  return { results, errors };
}

function generateFileContent(results) {
  const entries = Object.entries(results)
    .map(([name, coords]) => {
      // Escapa aspas no endereço
      const cleanAddress = coords.address.replace(/"/g, '\\"');
      return `  "${name}": { lat: ${coords.lat}, lng: ${coords.lng}, address: "${cleanAddress}" }`;
    })
    .join(",\n");

  return `// Coordenadas geradas automaticamente
// Data: ${new Date().toISOString()}
// Total de bares: ${Object.keys(results).length}

export const barCoordinates = {
${entries}
};

export const getBarCoordinates = (barName) => {
  return barCoordinates[barName] || null;
};

export const getAllCoordinates = () => {
  return Object.entries(barCoordinates).map(([name, coords]) => ({
    name,
    ...coords,
  }));
};
`;
}

// Executa se for chamado diretamente
if (require.main === module) {
  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "SUA_API_KEY_AQUI") {
    console.error("❌ ERRO: Configure a GOOGLE_MAPS_API_KEY primeiro!");
    console.log("\n📝 OPÇÕES:");
    console.log(
      '1. Variável de ambiente: export VITE_GOOGLE_MAPS_API_KEY="sua_chave"'
    );
    console.log("2. Ou edite este arquivo e coloque sua chave na linha 13");
    console.log(
      "\n🔑 Obtenha sua chave em: https://console.cloud.google.com/google/maps-apis/"
    );
    process.exit(1);
  }

  console.log("🔑 API Key configurada!");
  console.log("⚠️  ATENÇÃO: Isso fará 124 chamadas à API do Google Maps");
  console.log("💰 Custo estimado: ~$0.62 USD\n");

  geocodeAllBars()
    .then(() => {
      console.log("\n✅ Pronto! Agora copie o arquivo gerado:");
      console.log(
        "   cp src/data/barCoordinates_generated.js src/data/barCoordinates.js"
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Erro fatal:", error);
      process.exit(1);
    });
}

module.exports = { geocodeAllBars, geocodeAddress };
