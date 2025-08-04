import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Check, X, Eye, Users, FileText, Calendar, Gift, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  email: string;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  participatesInLottery: boolean;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [approvedProjects, setApprovedProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLotteryActive, setIsLotteryActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
      const lotteryStatus = localStorage.getItem('lotteryActive') === 'true';
      setIsLotteryActive(lotteryStatus);
    }
  }, [isOpen]);

  const loadProjects = () => {
    const pending = JSON.parse(localStorage.getItem('pendingProjects') || '[]');
    const approved = JSON.parse(localStorage.getItem('approvedProjects') || '[]');
    setPendingProjects(pending);
    setApprovedProjects(approved);
  };

  const handleApproveProject = (project: Project) => {
    // Remove from pending
    const updatedPending = pendingProjects.filter(p => p.id !== project.id);
    setPendingProjects(updatedPending);
    localStorage.setItem('pendingProjects', JSON.stringify(updatedPending));

    // Add to approved with lottery participation if lottery is active
    const approvedProject = {
      ...project,
      status: 'approved' as const,
      approvedAt: new Date().toISOString(),
      participatesInLottery: isLotteryActive
    };

    const updatedApproved = [...approvedProjects, approvedProject];
    setApprovedProjects(updatedApproved);
    localStorage.setItem('approvedProjects', JSON.stringify(updatedApproved));

    toast.success(`Projeto "${project.title}" aprovado com sucesso!`);
    setSelectedProject(null);
  };

  const handleRejectProject = (project: Project) => {
    const updatedPending = pendingProjects.filter(p => p.id !== project.id);
    setPendingProjects(updatedPending);
    localStorage.setItem('pendingProjects', JSON.stringify(updatedPending));

    toast.success(`Projeto "${project.title}" rejeitado.`);
    setSelectedProject(null);
  };

  const toggleLottery = () => {
    const newStatus = !isLotteryActive;
    setIsLotteryActive(newStatus);
    localStorage.setItem('lotteryActive', newStatus.toString());

    // Update all approved projects to participate in lottery if activated
    if (newStatus) {
      const updatedApproved = approvedProjects.map(project => ({
        ...project,
        participatesInLottery: true
      }));
      setApprovedProjects(updatedApproved);
      localStorage.setItem('approvedProjects', JSON.stringify(updatedApproved));
      toast.success('Sorteio ativado! Todos os projetos aprovados agora participam do sorteio.');
    } else {
      const updatedApproved = approvedProjects.map(project => ({
        ...project,
        participatesInLottery: false
      }));
      setApprovedProjects(updatedApproved);
      localStorage.setItem('approvedProjects', JSON.stringify(updatedApproved));
      toast.success('Sorteio desativado.');
    }
  };

  const ProjectCard = ({ project, showActions = false }: { project: Project; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Por: {project.author}</p>
            <p className="text-xs text-gray-500">{project.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            {project.participatesInLottery && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Gift className="h-3 w-3 mr-1" />
                Participa do Sorteio
              </Badge>
            )}
            <Badge variant={project.status === 'approved' ? 'default' : 'secondary'}>
              {project.status === 'pending' ? 'Pendente' : 'Aprovado'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {project.image && (
          <div className="mb-4">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover rounded-lg border"
            />
          </div>
        )}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{project.description}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProject(project)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalhes
          </Button>
          {showActions && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleApproveProject(project)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRejectProject(project)}
              >
                <X className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-800">
              Dashboard Administrativo
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Lottery Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Controle do Sorteio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Status do sorteio: {isLotteryActive ? 'Ativo' : 'Inativo'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {isLotteryActive 
                        ? 'Novos projetos aprovados participarão automaticamente do sorteio'
                        : 'Ative o sorteio para que os projetos possam participar'
                      }
                    </p>
                  </div>
                  <Button
                    onClick={toggleLottery}
                    variant={isLotteryActive ? "destructive" : "default"}
                    className={isLotteryActive ? "" : "bg-green-600 hover:bg-green-700"}
                  >
                    {isLotteryActive ? 'Desativar Sorteio' : 'Ativar Sorteio'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{pendingProjects.length}</p>
                      <p className="text-sm text-gray-600">Projetos Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{approvedProjects.length}</p>
                      <p className="text-sm text-gray-600">Projetos Aprovados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {approvedProjects.filter(p => p.participatesInLottery).length}
                      </p>
                      <p className="text-sm text-gray-600">No Sorteio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Tabs */}
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">
                  Projetos Pendentes ({pendingProjects.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Projetos Aprovados ({approvedProjects.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingProjects.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum projeto pendente</p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingProjects.map(project => (
                    <ProjectCard key={project.id} project={project} showActions={true} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedProjects.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum projeto aprovado</p>
                    </CardContent>
                  </Card>
                ) : (
                  approvedProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Detail Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedProject.image && (
                <div>
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-2">Autor</h4>
                <p>{selectedProject.author}</p>
                <p className="text-sm text-gray-600">{selectedProject.email}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Descrição</h4>
                <p className="text-gray-700">{selectedProject.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                <div className="flex gap-2">
                  <Badge variant={selectedProject.status === 'approved' ? 'default' : 'secondary'}>
                    {selectedProject.status === 'pending' ? 'Pendente' : 'Aprovado'}
                  </Badge>
                  {selectedProject.participatesInLottery && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Gift className="h-3 w-3 mr-1" />
                      Participa do Sorteio
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data de Submissão</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedProject.submittedAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}