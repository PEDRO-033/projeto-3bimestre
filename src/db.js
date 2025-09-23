// db.js
import { PrismaClient } from "@prisma/client";

// Criar uma instância única do Prisma (padrão Singleton)
const prisma = new PrismaClient();

// Conectar ao banco assim que o módulo for carregado
prisma
  .$connect()
  .then(() => {
    console.log("✅ Conectado ao banco de dados!");
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar:", error.message);
  });

// Exportar a instância para ser usada nas rotas
export default prisma;
