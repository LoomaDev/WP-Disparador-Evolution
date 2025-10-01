-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  is_super_admin BOOLEAN DEFAULT FALSE
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  api_url VARCHAR(200),
  global_api_key VARCHAR(200),
  default_message TEXT
);

-- Tabela de instâncias
CREATE TABLE IF NOT EXISTS instances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  instance_name VARCHAR(100) NOT NULL,
  integration VARCHAR(50) NOT NULL,
  api_key VARCHAR(200) NOT NULL,
  instance_id VARCHAR(100),
  hash VARCHAR(200),
  qrcode TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de listas de disparo
CREATE TABLE IF NOT EXISTS lists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente',
  data_envio TIMESTAMP
);
