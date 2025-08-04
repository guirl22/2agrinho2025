<?php
/**
 * Campo Cidade Conecta Sustentável
 * Configuração de Banco de Dados
 * 
 * Este arquivo contém as configurações de conexão com o banco de dados MySQL
 * para uso com XAMPP e hospedagem web
 */

// Configurações do banco de dados
// Para desenvolvimento local (XAMPP)
if ($_SERVER['HTTP_HOST'] === 'localhost' || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false) {
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'campo_cidade_conecta');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('SITE_URL', 'http://localhost/campo-cidade-conecta');
} else {
    // Para produção - ALTERE ESTAS CONFIGURAÇÕES
    define('DB_HOST', 'localhost'); // ou o host fornecido pela hospedagem
    define('DB_NAME', 'seu_banco_de_dados');
    define('DB_USER', 'seu_usuario');
    define('DB_PASS', 'sua_senha');
    define('SITE_URL', 'https://seudominio.com.br');
}

define('DB_CHARSET', 'utf8mb4');

// Configurações de upload
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('UPLOAD_URL', SITE_URL . '/uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB em bytes
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Configurações do sistema
define('SITE_NAME', 'Campo Cidade Conecta Sustentável');
define('ADMIN_EMAIL', 'admin@seudominio.com.br');

// Configurações de segurança - ALTERE EM PRODUÇÃO
define('JWT_SECRET', 'mude_esta_chave_secreta_em_producao_' . md5(__DIR__));
define('PASSWORD_SALT', 'mude_este_salt_em_producao_' . md5(__FILE__));

// Configurações de sessão
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));

class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $charset = DB_CHARSET;
    public $conn;

    /**
     * Conectar ao banco de dados
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $exception) {
            error_log("Erro de conexão com banco: " . $exception->getMessage());
            throw new Exception("Erro de conexão com banco de dados");
        }

        return $this->conn;
    }

    /**
     * Testar conexão com o banco
     */
    public function testConnection() {
        try {
            $conn = $this->getConnection();
            if ($conn) {
                return [
                    'success' => true,
                    'message' => 'Conexão com banco de dados estabelecida com sucesso!'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao conectar com banco de dados: ' . $e->getMessage()
            ];
        }
    }
}

/**
 * Classe para gerenciar projetos
 */
class ProjectManager {
    private $conn;
    private $table_name = "projects";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Criar novo projeto
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (title, description, author, email, image_path, status, participates_in_lottery) 
                  VALUES (:title, :description, :author, :email, :image_path, :status, :participates_in_lottery)";

        $stmt = $this->conn->prepare($query);

        // Sanitizar dados
        $data['title'] = htmlspecialchars(strip_tags($data['title']), ENT_QUOTES, 'UTF-8');
        $data['description'] = htmlspecialchars(strip_tags($data['description']), ENT_QUOTES, 'UTF-8');
        $data['author'] = htmlspecialchars(strip_tags($data['author']), ENT_QUOTES, 'UTF-8');
        $data['email'] = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

        // Validar email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Email inválido");
        }

        // Bind dos parâmetros
        $stmt->bindParam(":title", $data['title']);
        $stmt->bindParam(":description", $data['description']);
        $stmt->bindParam(":author", $data['author']);
        $stmt->bindParam(":email", $data['email']);
        $stmt->bindParam(":image_path", $data['image_path']);
        $stmt->bindParam(":status", $data['status']);
        $stmt->bindParam(":participates_in_lottery", $data['participates_in_lottery'], PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }

        return false;
    }

    /**
     * Buscar projetos por status
     */
    public function getByStatus($status) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE status = :status ORDER BY submitted_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Buscar projeto por ID
     */
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Atualizar status do projeto
     */
    public function updateStatus($id, $status, $approved_by = null) {
        $query = "UPDATE " . $this->table_name . " 
                  SET status = :status, approved_by = :approved_by";
        
        if ($status === 'approved') {
            $query .= ", approved_at = NOW()";
        }
        
        $query .= " WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":approved_by", $approved_by);
        $stmt->bindParam(":id", $id);

        return $stmt->execute();
    }

    /**
     * Upload de imagem
     */
    public function uploadImage($file) {
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return ['success' => false, 'message' => 'Nenhum arquivo enviado'];
        }

        // Verificar se houve erro no upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['success' => false, 'message' => 'Erro no upload: ' . $this->getUploadError($file['error'])];
        }

        // Verificar tamanho do arquivo
        if ($file['size'] > MAX_FILE_SIZE) {
            return ['success' => false, 'message' => 'Arquivo muito grande. Máximo 5MB'];
        }

        // Verificar se é realmente uma imagem
        $imageInfo = getimagesize($file['tmp_name']);
        if ($imageInfo === false) {
            return ['success' => false, 'message' => 'Arquivo não é uma imagem válida'];
        }

        // Verificar extensão
        $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($file_extension, ALLOWED_EXTENSIONS)) {
            return ['success' => false, 'message' => 'Tipo de arquivo não permitido. Use: ' . implode(', ', ALLOWED_EXTENSIONS)];
        }

        // Gerar nome único
        $new_filename = uniqid() . '_' . time() . '.' . $file_extension;
        $upload_dir = dirname(UPLOAD_PATH);
        
        // Criar diretório se não existir
        if (!file_exists($upload_dir)) {
            if (!mkdir($upload_dir, 0755, true)) {
                return ['success' => false, 'message' => 'Erro ao criar diretório de upload'];
            }
        }

        $upload_path = $upload_dir . '/' . $new_filename;

        // Mover arquivo
        if (move_uploaded_file($file['tmp_name'], $upload_path)) {
            return [
                'success' => true,
                'filename' => $new_filename,
                'path' => $upload_path,
                'url' => UPLOAD_URL . $new_filename
            ];
        }

        return ['success' => false, 'message' => 'Erro ao fazer upload do arquivo'];
    }

    /**
     * Obter mensagem de erro de upload
     */
    private function getUploadError($error_code) {
        switch ($error_code) {
            case UPLOAD_ERR_INI_SIZE:
                return 'Arquivo muito grande (limite do servidor)';
            case UPLOAD_ERR_FORM_SIZE:
                return 'Arquivo muito grande (limite do formulário)';
            case UPLOAD_ERR_PARTIAL:
                return 'Upload incompleto';
            case UPLOAD_ERR_NO_FILE:
                return 'Nenhum arquivo enviado';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'Diretório temporário não encontrado';
            case UPLOAD_ERR_CANT_WRITE:
                return 'Erro ao escrever arquivo';
            case UPLOAD_ERR_EXTENSION:
                return 'Upload bloqueado por extensão';
            default:
                return 'Erro desconhecido';
        }
    }
}

/**
 * Classe para gerenciar configurações do sistema
 */
class SystemSettings {
    private $conn;
    private $table_name = "system_settings";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Buscar configuração por chave
     */
    public function get($key) {
        $query = "SELECT setting_value FROM " . $this->table_name . " WHERE setting_key = :key";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":key", $key);
        $stmt->execute();

        $result = $stmt->fetch();
        return $result ? $result['setting_value'] : null;
    }

    /**
     * Atualizar configuração
     */
    public function set($key, $value) {
        $query = "INSERT INTO " . $this->table_name . " (setting_key, setting_value) 
                  VALUES (:key, :value) 
                  ON DUPLICATE KEY UPDATE setting_value = :value";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":key", $key);
        $stmt->bindParam(":value", $value);

        return $stmt->execute();
    }

    /**
     * Verificar se sorteio está ativo
     */
    public function isLotteryActive() {
        return $this->get('lottery_active') === 'true';
    }

    /**
     * Ativar/desativar sorteio
     */
    public function setLotteryStatus($active) {
        return $this->set('lottery_active', $active ? 'true' : 'false');
    }
}

/**
 * Função para log de atividades
 */
function logActivity($action, $entity_type, $entity_id = null, $description = null, $user_id = null) {
    try {
        $database = new Database();
        $conn = $database->getConnection();
        
        $query = "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, ip_address, user_agent) 
                  VALUES (:user_id, :action, :entity_type, :entity_id, :description, :ip_address, :user_agent)";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":action", $action);
        $stmt->bindParam(":entity_type", $entity_type);
        $stmt->bindParam(":entity_id", $entity_id);
        $stmt->bindParam(":description", $description);
        $stmt->bindValue(":ip_address", $_SERVER['REMOTE_ADDR'] ?? null);
        $stmt->bindValue(":user_agent", $_SERVER['HTTP_USER_AGENT'] ?? null);
        
        return $stmt->execute();
    } catch (Exception $e) {
        error_log("Erro ao registrar log: " . $e->getMessage());
        return false;
    }
}

/**
 * Função para validar e sanitizar dados
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

/**
 * Função para gerar resposta JSON
 */
function jsonResponse($data, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Configurar timezone
date_default_timezone_set('America/Sao_Paulo');

// Configurar tratamento de erros
error_reporting(E_ALL);
ini_set('display_errors', 0); // Desabilitar em produção
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php_errors.log');
?>