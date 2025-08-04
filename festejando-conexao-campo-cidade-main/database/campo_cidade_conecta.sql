-- Banco de Dados: Campo Cidade Conecta Sustentável
-- Sistema de gestão de projetos sustentáveis com sorteio
-- Criado para uso com XAMPP/MySQL

CREATE DATABASE IF NOT EXISTS campo_cidade_conecta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campo_cidade_conecta;

-- Tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de projetos
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    image_path VARCHAR(500) NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    participates_in_lottery BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    approved_by INT NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabela de configurações do sistema
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de sorteios
CREATE TABLE lotteries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    winner_project_id INT NULL,
    drawn_at TIMESTAMP NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (winner_project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de participações no sorteio
CREATE TABLE lottery_participations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lottery_id INT NOT NULL,
    project_id INT NOT NULL,
    participated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_participation (lottery_id, project_id)
);

-- Tabela de posts do blog
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NULL,
    featured_image VARCHAR(500) NULL,
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de logs de atividades
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NULL,
    description TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Inserir usuário administrador padrão
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@campocidade.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Inserir configurações padrão do sistema
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'Campo Cidade Conecta Sustentável', 'Nome do site'),
('lottery_active', 'false', 'Status do sorteio (true/false)'),
('max_file_size', '5242880', 'Tamanho máximo de arquivo em bytes (5MB)'),
('allowed_file_types', 'jpg,jpeg,png,gif', 'Tipos de arquivo permitidos para upload'),
('projects_per_page', '12', 'Número de projetos por página'),
('auto_approve_projects', 'false', 'Aprovação automática de projetos (true/false)');

-- Inserir sorteio padrão
INSERT INTO lotteries (title, description, is_active, created_by) VALUES
('Sorteio de Projetos Sustentáveis 2024', 'Sorteio anual para premiar os melhores projetos sustentáveis da comunidade', false, 1);

-- Índices para melhor performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_lottery ON projects(participates_in_lottery);
CREATE INDEX idx_projects_submitted ON projects(submitted_at);
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_published ON blog_posts(published_at);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- Views úteis
CREATE VIEW approved_projects_view AS
SELECT 
    p.*,
    u.name as approved_by_name
FROM projects p
LEFT JOIN users u ON p.approved_by = u.id
WHERE p.status = 'approved';

CREATE VIEW lottery_projects_view AS
SELECT 
    p.*,
    l.title as lottery_title,
    l.is_active as lottery_active
FROM projects p
JOIN lottery_participations lp ON p.id = lp.project_id
JOIN lotteries l ON lp.lottery_id = l.id
WHERE p.status = 'approved' AND p.participates_in_lottery = TRUE;

-- Triggers para logs automáticos
DELIMITER //

CREATE TRIGGER project_status_change_log
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO activity_logs (action, entity_type, entity_id, description)
        VALUES (
            CONCAT('project_', NEW.status),
            'project',
            NEW.id,
            CONCAT('Projeto "', NEW.title, '" mudou status de ', OLD.status, ' para ', NEW.status)
        );
    END IF;
END//

CREATE TRIGGER new_project_log
AFTER INSERT ON projects
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (action, entity_type, entity_id, description)
    VALUES (
        'project_created',
        'project',
        NEW.id,
        CONCAT('Novo projeto criado: "', NEW.title, '" por ', NEW.author)
    );
END//

DELIMITER ;

-- Comentários das tabelas
ALTER TABLE users COMMENT = 'Tabela de usuários do sistema';
ALTER TABLE projects COMMENT = 'Tabela de projetos sustentáveis';
ALTER TABLE system_settings COMMENT = 'Configurações gerais do sistema';
ALTER TABLE lotteries COMMENT = 'Tabela de sorteios';
ALTER TABLE lottery_participations COMMENT = 'Participações dos projetos nos sorteios';
ALTER TABLE blog_posts COMMENT = 'Posts do blog/notícias';
ALTER TABLE activity_logs COMMENT = 'Logs de atividades do sistema';