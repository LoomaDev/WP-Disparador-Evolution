#!/bin/bash
# Script para instalar, configurar e iniciar o backend com PostgreSQL

set -e

echo "Atualizando pacotes..."
sudo apt-get update

echo "Instalando PostgreSQL..."
sudo apt-get install -y postgresql postgresql-contrib

echo "Iniciando serviço PostgreSQL..."
sudo service postgresql start

echo "Criando banco de dados wp_disparador..."
sudo -u postgres createdb wp_disparador || echo "Banco já existe."

echo "Executando script de tabelas..."
sudo -u postgres psql -d wp_disparador -f $(dirname "$0")/init.sql

echo "Instalando dependências do backend..."
cd $(dirname "$0")
npm install

echo "Backend pronto para rodar!"
echo "Para iniciar: npm run dev"
