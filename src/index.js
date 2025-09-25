// index.js
import express from "express";
import dotenv from "dotenv";
import prisma from "./db.js"; // Importa a conexão com o banco

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar aplicação Express
const app = express();

// Middleware para processar JSON nas requisições
app.use(express.json());

// ====================== HEALTHCHECK ======================
app.get("/", (_req, res) =>
  res.json({ ok: true, service: "API 3º Bimestre" })
);

app.get("/status", (_req, res) => {
  res.json({ message: "API Online" });
});

// ====================== USUÁRIOS ======================

// CREATE: POST /usuarios
app.post("/usuarios", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const novoUsuario = await prisma.user.create({
      data: { name, email, password },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// READ: GET /usuarios
app.get("/usuarios", async (_req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// UPDATE: PUT /usuarios/:id
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const usuario = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { name, email, password },
    });
    res.json(usuario);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// DELETE: DELETE /usuarios/:id
app.delete("/usuarios/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

// ====================== STORES ======================

// CREATE: POST /stores
app.post("/stores", async (req, res) => {
  try {
    const { name, userId } = req.body;
    const store = await prisma.store.create({
      data: { name, userId: Number(userId) },
    });
    res.status(201).json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// READ: GET /stores (lista todas as lojas)
app.get("/stores", async (_req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: { user: true, products: true },
      orderBy: { id: "asc" }
    });
    res.json(stores);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// UPDATE: PUT /stores/:id
app.put("/stores/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const store = await prisma.store.update({
      where: { id: Number(req.params.id) },
      data: { name },
    });
    res.json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE: DELETE /stores/:id
app.delete("/stores/:id", async (req, res) => {
  try {
    await prisma.store.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Loja deletada com sucesso" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ====================== PRODUCTS ======================

// CREATE: POST /products
app.post("/products", async (req, res) => {
  try {
    const { name, price, storeId } = req.body;
    const product = await prisma.product.create({
      data: { name, price: Number(price), storeId: Number(storeId) },
    });
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// READ: GET /products (inclui loja + dono da loja)
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { store: { include: { user: true } } },
    });
    res.json(products);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// UPDATE: PUT /products/:id
app.put("/products/:id", async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { name, price: Number(price) },
    });
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE: DELETE /products/:id
app.delete("/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Produto deletado com sucesso" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ====================== SERVER ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
