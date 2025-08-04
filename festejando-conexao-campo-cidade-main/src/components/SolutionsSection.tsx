import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, Gift, Calendar, User, Image as ImageIcon } from 'lucide-react';
import { SolutionDetailModal } from './SolutionDetailModal';

interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  email: string;
  image?: string;
  status: string;
  submittedAt: string;
  approvedAt?: string;
  participatesInLottery: boolean;
}

export function SolutionsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLotteryActive, setIsLotteryActive] = useState(false);

  useEffect(() => {
    loadProjects();
    const lotteryStatus = localStorage.getItem('lotteryActive') === 'true';
    setIsLotteryActive(lotteryStatus);
  }, []);

  const loadProjects = () => {
    const approvedProjects = JSON.parse(localStorage.getItem('approvedProjects') || '[]');
    setProjects(approvedProjects);
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-green-800 line-clamp-2">
            {project.title}
          </CardTitle>
          {project.participatesInLottery && isLotteryActive && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 ml-2 flex-shrink-0">
              <Gift className="h-3 w-3 mr-1" />
              Sorteio
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{project.author}</span>
        </div>
        {project.approvedAt && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Aprovado em {new Date(project.approvedAt).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {project.image ? (
          <div className="mb-4">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover rounded-lg border shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="mb-4 h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Sem imagem</p>
            </div>
          </div>
        )}
        
        <p className="text-gray-700 text-sm line-clamp-3 flex-1 mb-4">
          {project.description}
        </p>
        
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProject(project)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section id="solutions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Soluções Sustentáveis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça os projetos aprovados que estão fazendo a diferença em nossa comunidade
          </p>
          {isLotteryActive && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-yellow-800">
                <Gift className="h-5 w-5" />
                <span className="font-semibold">Sorteio Ativo!</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Projetos marcados com o selo "Sorteio" estão participando do sorteio atual
              </p>
            </div>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum projeto aprovado ainda
              </h3>
              <p className="text-gray-500">
                Os projetos aprovados aparecerão aqui em breve
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Total de Projetos Aprovados: {projects.length}
              </h3>
              {isLotteryActive && (
                <p className="text-sm text-gray-600">
                  {projects.filter(p => p.participatesInLottery).length} projetos participando do sorteio
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedProject && (
        <SolutionDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}