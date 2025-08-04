<?php
/**
 * API para gerenciamento de projetos
 * Campo Cidade Conecta Sustentável
 */

require_once '../config/database.php';

// Configurar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Tratar requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    $projectManager = new ProjectManager($conn);
    $systemSettings = new SystemSettings($conn);

    $method = $_SERVER['REQUEST_METHOD'];
    $request_uri = $_SERVER['REQUEST_URI'];
    $path_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));

    switch ($method) {
        case 'GET':
            handleGetRequest($projectManager, $systemSettings, $path_parts);
            break;
        
        case 'POST':
            handlePostRequest($projectManager, $systemSettings);
            break;
        
        case 'PUT':
            handlePutRequest($projectManager, $path_parts);
            break;
        
        case 'DELETE':
            handleDeleteRequest($projectManager, $path_parts);
            break;
        
        default:
            jsonResponse(['error' => 'Método não permitido'], 405);
    }

} catch (Exception $e) {
    error_log("Erro na API: " . $e->getMessage());
    jsonResponse(['error' => 'Erro interno do servidor'], 500);
}

function handleGetRequest($projectManager, $systemSettings, $path_parts) {
    // GET /api/projects.php - Listar todos os projetos aprovados
    // GET /api/projects.php?status=pending - Listar projetos por status
    // GET /api/projects.php/123 - Buscar projeto específico
    
    if (isset($path_parts[2]) && is_numeric($path_parts[2])) {
        // Buscar projeto específico
        $project = $projectManager->getById($path_parts[2]);
        if ($project) {
            jsonResponse($project);
        } else {
            jsonResponse(['error' => 'Projeto não encontrado'], 404);
        }
    } else {
        // Listar projetos
        $status = $_GET['status'] ?? 'approved';
        $projects = $projectManager->getByStatus($status);
        
        // Adicionar informações do sorteio
        $isLotteryActive = $systemSettings->isLotteryActive();
        
        jsonResponse([
            'projects' => $projects,
            'lottery_active' => $isLotteryActive,
            'total' => count($projects)
        ]);
    }
}

function handlePostRequest($projectManager, $systemSettings) {
    // POST /api/projects.php - Criar novo projeto
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar dados obrigatórios
    $required_fields = ['title', 'description', 'author', 'email'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            jsonResponse(['error' => "Campo '$field' é obrigatório"], 400);
        }
    }
    
    // Processar upload de imagem se fornecida
    $image_path = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_result = $projectManager->uploadImage($_FILES['image']);
        if ($upload_result['success']) {
            $image_path = $upload_result['filename'];
        } else {
            jsonResponse(['error' => $upload_result['message']], 400);
        }
    }
    
    // Verificar se sorteio está ativo
    $participates_in_lottery = $systemSettings->isLotteryActive();
    
    $project_data = [
        'title' => $input['title'],
        'description' => $input['description'],
        'author' => $input['author'],
        'email' => $input['email'],
        'image_path' => $image_path,
        'status' => 'pending',
        'participates_in_lottery' => $participates_in_lottery
    ];
    
    $project_id = $projectManager->create($project_data);
    
    if ($project_id) {
        logActivity('project_created', 'project', $project_id, 
                   "Novo projeto criado: {$input['title']} por {$input['author']}");
        
        jsonResponse([
            'success' => true,
            'message' => 'Projeto enviado com sucesso!',
            'project_id' => $project_id
        ], 201);
    } else {
        jsonResponse(['error' => 'Erro ao criar projeto'], 500);
    }
}

function handlePutRequest($projectManager, $path_parts) {
    // PUT /api/projects.php/123 - Atualizar status do projeto
    
    if (!isset($path_parts[2]) || !is_numeric($path_parts[2])) {
        jsonResponse(['error' => 'ID do projeto inválido'], 400);
    }
    
    $project_id = $path_parts[2];
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['status'])) {
        jsonResponse(['error' => 'Status é obrigatório'], 400);
    }
    
    $allowed_statuses = ['pending', 'approved', 'rejected'];
    if (!in_array($input['status'], $allowed_statuses)) {
        jsonResponse(['error' => 'Status inválido'], 400);
    }
    
    $approved_by = $input['approved_by'] ?? null;
    
    if ($projectManager->updateStatus($project_id, $input['status'], $approved_by)) {
        logActivity('project_status_changed', 'project', $project_id, 
                   "Status do projeto alterado para: {$input['status']}");
        
        jsonResponse([
            'success' => true,
            'message' => 'Status do projeto atualizado com sucesso!'
        ]);
    } else {
        jsonResponse(['error' => 'Erro ao atualizar projeto'], 500);
    }
}

function handleDeleteRequest($projectManager, $path_parts) {
    // DELETE /api/projects.php/123 - Deletar projeto (apenas admin)
    
    if (!isset($path_parts[2]) || !is_numeric($path_parts[2])) {
        jsonResponse(['error' => 'ID do projeto inválido'], 400);
    }
    
    // Implementar autenticação de admin aqui
    // Por enquanto, retornar erro
    jsonResponse(['error' => 'Funcionalidade não implementada'], 501);
}
?>
