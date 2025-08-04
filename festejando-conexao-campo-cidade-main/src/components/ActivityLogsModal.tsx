
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ActivityLogsModalProps {
  onClose: () => void;
}

const ActivityLogsModal = ({ onClose }: ActivityLogsModalProps) => {
  const [dateFilter, setDateFilter] = useState('');
  const [ipFilter, setIpFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  
  // Mock data - Em produção, viria do banco MySQL
  const mockLogs = [
    {
      id: 1,
      timestamp: '2025-01-16 10:30:15',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      hostname: 'desktop-abc123',
      os: 'Windows 10',
      action: 'Login realizado',
      user: 'João Silva',
      details: 'Usuário fez login com sucesso'
    },
    {
      id: 2,
      timestamp: '2025-01-16 10:35:22',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      hostname: 'desktop-abc123',
      os: 'Windows 10',
      action: 'Projeto submetido',
      user: 'João Silva',
      details: 'Projeto "Aplicativo Mobile" foi submetido'
    },
    {
      id: 3,
      timestamp: '2025-01-16 11:15:45',
      ip: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      hostname: 'macbook-xyz789',
      os: 'macOS Big Sur',
      action: 'Página acessada',
      user: 'Maria Santos',
      details: 'Acessou a página de soluções'
    }
  ];

  const filteredLogs = mockLogs.filter(log => {
    return (
      (!dateFilter || log.timestamp.includes(dateFilter)) &&
      (!ipFilter || log.ip.includes(ipFilter)) &&
      (!userFilter || log.user.toLowerCase().includes(userFilter.toLowerCase()))
    );
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-primary text-adjustable">
                Logs de Atividade do Sistema
              </CardTitle>
              <CardDescription className="text-adjustable">
                Visualize todas as atividades realizadas no sistema pelos usuários.
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <label className="text-sm font-medium text-adjustable mb-2 block">
                Filtrar por Data:
              </label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-adjustable"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-adjustable mb-2 block">
                Filtrar por IP:
              </label>
              <Input
                placeholder="192.168.1.100"
                value={ipFilter}
                onChange={(e) => setIpFilter(e.target.value)}
                className="text-adjustable"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-adjustable mb-2 block">
                Filtrar por Usuário:
              </label>
              <Input
                placeholder="Nome do usuário"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="text-adjustable"
              />
            </div>
          </div>

          {/* Tabela de Logs */}
          <div className="border rounded-lg max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-adjustable">Data/Hora</TableHead>
                  <TableHead className="text-adjustable">Usuário</TableHead>
                  <TableHead className="text-adjustable">IP</TableHead>
                  <TableHead className="text-adjustable">Sistema</TableHead>
                  <TableHead className="text-adjustable">Ação</TableHead>
                  <TableHead className="text-adjustable">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-adjustable text-xs">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="text-adjustable text-xs">
                      {log.user}
                    </TableCell>
                    <TableCell className="text-adjustable text-xs">
                      {log.ip}
                    </TableCell>
                    <TableCell className="text-adjustable text-xs">
                      <div>
                        <div>{log.os}</div>
                        <div className="text-muted-foreground">{log.hostname}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-adjustable text-xs">
                      {log.action}
                    </TableCell>
                    <TableCell className="text-adjustable text-xs">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-adjustable">
                  Nenhum log encontrado com os filtros aplicados.
                </p>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <p className="text-adjustable">
              Mostrando {filteredLogs.length} de {mockLogs.length} registros
            </p>
            <p className="text-adjustable text-xs mt-1">
              * Para implementar logs completos e banco MySQL, conecte ao Supabase
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogsModal;
