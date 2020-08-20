const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

//cria array geral para manter os dados
const repositories = [];

app.get("/repositories", (request, response) => {
  //Retorna o proprio array geral
  return response.json([repositories])
});

app.post("/repositories", (request, response) => {
  //obtem os dados enviados no body da requisicao
  const { title, url, techs } = request.body
  let likes = 0

  //cria array transitorio com id para gravar
  const repositorie = { id: uuid(), title, url, techs, likes }

  //adiciona os dados recebidos do array com id ao array geral
  repositories.push(repositorie)

  //exibe os dados na saida
  return response.json(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs} = request.body

  //obtem os dados e separa o like para nao apagar na atualizacao
  const repositorieData = repositories.find(repositorie => repositorie.id == id)
  
  //localiza index no array com o id enviado
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id)
  
  //compara se teve resultado -1 se não teve e retorna mensagem not found
  if(repositorieIndex < 0 ){
    return response.status('400').json({error : 'Repositorie not found.'})
  }

  const likes = repositorieData.likes 
  const repositorie = {id, title, url, techs, likes}

  repositories[repositorieIndex] = repositorie

  return response.json(repositorie)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  //localiza index no array com o id enviado
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id)
  
  //compara se teve resultado -1 se não teve e retorna mensagem not found
  if(repositorieIndex < 0 ){
    return response.status('400').json({error : 'Repositorie not found.'})
  }

  repositories.splice(repositorieIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositorieData = repositories.find(repositorie => repositorie.id == id)
  //localiza index no array com o id enviado
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id == id)
  
  //compara se teve resultado -1 se não teve e retorna mensagem not found
  if(repositorieIndex < 0 ){
    return response.status('400').json({error : 'Repositorie not found.'})
  }

  let count = repositorieData.likes  
  count++

  repositorieData.likes = count

  repositories[repositorieIndex] = repositorieData

  return response.json(repositorieData)
});

module.exports = app;
