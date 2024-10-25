#!/bin/bash

IMAGE_NAME="hierarchy-builder"
PORT=3000

echo "🚀 Iniciando a construção da imagem Docker..."
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
  echo "❌ Erro durante a construção da imagem Docker!"
  exit 1
fi

echo "✅ Imagem Docker construída com sucesso: $IMAGE_NAME"

CONTAINER_ID=$(docker ps -q --filter "ancestor=$IMAGE_NAME")

if [ -n "$CONTAINER_ID" ]; then
  echo "🛑 Parando o container antigo..."
  docker stop $CONTAINER_ID
fi

echo "🚀 Iniciando o container na porta $PORT..."
docker run -d -p $PORT:80 $IMAGE_NAME

if [ $? -ne 0 ]; then
  echo "❌ Erro ao iniciar o container!"
  exit 1
fi

echo "✅ Container iniciado com sucesso. Acesse em http://localhost:$PORT"
