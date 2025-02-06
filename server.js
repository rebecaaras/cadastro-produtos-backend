const express = require("express");
const db = require("./db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //Middleware para passar o corpo para um objeto JSON()

//GET rota para testar conexão
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.send(`Banco de dados conectado: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao conectar com o banco de dados.");
  }
});

//GET rota para buscar todos os produtos
app.get("/produtos", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM produtos");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar produtos.");
  }
});

app.post("/produtos", async (req, res) => {
  const { nome_produto, descricao, preco, disponibilidade } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO produtos (nome_produto, descricao, preco, disponibilidade) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome_produto, descricao, preco, disponibilidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao cadastrar produto.");
  }
});

//DELETE rota para deletar um produto a partir do ID
app.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM produtos WHERE id = $1", [id]),
      res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar produto.");
  }
});

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
