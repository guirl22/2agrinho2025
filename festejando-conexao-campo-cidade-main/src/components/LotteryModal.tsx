import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface LotteryModalProps {
  onClose: () => void;
  pendingProjects: any[];
  approvedProjects: any[];
  onStartLottery: (prize: string) => void;
  onStopLottery: () => void;
  onSelectWinner: (projectId: number) => void;
  onRemoveFromLottery: (projectId: number, reason: string) => void;
  isLotteryActive: boolean;
  lotteryPrize: string;
  winner: any;
}

const LotteryModal = ({ 
  onClose, 
  pendingProjects, 
  approvedProjects, 
  onStartLottery,
  onStopLottery, 
  onSelectWinner, 
  onRemoveFromLottery,
  isLotteryActive,
  lotteryPrize,
  winner 
}: LotteryModalProps) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [removeReason, setRemoveReason] = useState('');
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [prizeInput, setPrizeInput] = useState('');
  const { toast } = useToast();

  // Projetos elegíveis para sorteio (apenas aprovados quando o sorteio está ativo)
  const lotteryProjects = isLotteryActive ? 
    approvedProjects.filter(p => p.inLottery !== false) : 
    [];

  const handleStartLottery = () => {
    if (!prizeInput.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o prêmio do sorteio.",
        variant: "destructive"
      });
      return;
    }
    
    onStartLottery(prizeInput);
    setPrizeInput('');
    toast({
      title: "Sorteio Iniciado!",
      description: "Todos os usuários serão notificados sobre o sorteio ativo.",
    });
  };

  const handleStopLottery = () => {
    onStopLottery();
    toast({
      title: "Sorteio Desativado",
      description: "O sorteio foi encerrado.",
    });
  };

  const handleSelectWinner = (project: any) => {
    onSelectWinner(project.id);
    toast({
      title: "Ganhador Selecionado!",
      description: `${project.author} foi selecionado como ganhador!`,
    });
  };

  const handleRemoveFromLottery = () => {
    if (selectedProject && removeReason.trim()) {
      onRemoveFromLottery(selectedProject.id, removeReason);
      setShowRemoveDialog(false);
      setRemoveReason('');
      setSelectedProject(null);
      toast({
        title: "Projeto Removido",
        description: "O projeto foi removido do sorteio.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-primary text-adjustable">
                Sistema de Sorteios
              </CardTitle>
              <CardDescription className="text-adjustable">
                Gerencie sorteios e selecione projetos ganhadores.
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
        
        <CardContent className="space-y-6">
          {/* Status do Sorteio */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-primary text-adjustable">
                  Status do Sorteio
                </h3>
                <p className="text-muted-foreground text-adjustable">
                  {isLotteryActive 
                    ? `Sorteio ativo - Prêmio: ${lotteryPrize}` 
                    : 'Nenhum sorteio ativo'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={isLotteryActive ? "default" : "secondary"}>
                  {isLotteryActive ? 'ATIVO' : 'INATIVO'}
                </Badge>
                {!isLotteryActive ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Descreva o prêmio..."
                      value={prizeInput}
                      onChange={(e) => setPrizeInput(e.target.value)}
                      className="w-48"
                    />
                    <Button onClick={handleStartLottery} className="text-adjustable">
                      Iniciar Sorteio
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleStopLottery} 
                    variant="destructive"
                    className="text-adjustable"
                  >
                    Desativar Sorteio
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Ganhador Atual */}
          {winner && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🏆 Projeto Ganhador
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-green-700">
                    #{winner.lotteryNumber} - {winner.title}
                  </p>
                  <p className="text-green-600">Por {winner.author}</p>
                </div>
                <Badge className="bg-green-600">GANHADOR</Badge>
              </div>
            </div>
          )}

          {/* Projetos Participantes */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 text-adjustable">
              Projetos Participantes ({lotteryProjects.length})
            </h3>
            
            {isLotteryActive ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lotteryProjects.map((project) => (
                  <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm text-adjustable">
                          #{project.lotteryNumber} - {project.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-adjustable text-xs">
                        Por {project.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => handleSelectWinner(project)}
                          className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                          disabled={!!winner}
                        >
                          Escolher
                        </Button>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedProject(project);
                            setShowRemoveDialog(true);
                          }}
                          className="text-xs"
                        >
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-adjustable">Inicie um sorteio para ver os projetos participantes.</p>
              </div>
            )}
          </div>

          {/* Modal de Remoção */}
          {showRemoveDialog && selectedProject && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-lg text-adjustable">
                    Remover do Sorteio
                  </CardTitle>
                  <CardDescription className="text-adjustable">
                    Projeto: {selectedProject.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-adjustable">
                      Motivo da exclusão:
                    </label>
                    <textarea
                      value={removeReason}
                      onChange={(e) => setRemoveReason(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      rows={3}
                      placeholder="Explique o motivo da exclusão..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowRemoveDialog(false);
                        setRemoveReason('');
                        setSelectedProject(null);
                      }}
                      className="text-adjustable"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleRemoveFromLottery}
                      disabled={!removeReason.trim()}
                      className="text-adjustable"
                    >
                      Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LotteryModal;
