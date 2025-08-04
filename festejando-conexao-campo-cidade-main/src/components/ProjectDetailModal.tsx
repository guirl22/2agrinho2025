
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectDetailModalProps {
  project: {
    id: number;
    lotteryNumber?: number;
    title: string;
    description: string;
    author: string;
    date: string;
    category: string;
    image?: string;
    businessInfo?: string;
    startupSteps?: string;
    investmentInfo?: string;
    marketAnalysis?: string;
    expectedReturn?: string;
    timeline?: string;
    region?: string;
  };
  onClose: () => void;
}

const ProjectDetailModal = ({ project, onClose }: ProjectDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl text-primary text-adjustable">
                  {project.lotteryNumber ? `#${project.lotteryNumber} - ` : ''}{project.title}
                </CardTitle>
                <Badge variant="outline">{project.category}</Badge>
              </div>
              <CardDescription className="text-adjustable">
                Por {project.author} • {project.date}
                {project.region && ` • ${project.region}`}
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
          {project.image && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-primary mb-3 text-adjustable">
              Sobre o Projeto
            </h3>
            <p className="text-muted-foreground text-adjustable leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.businessInfo && (
            <div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-adjustable">
                Sobre o Negócio
              </h3>
              <p className="text-muted-foreground text-adjustable leading-relaxed">
                {project.businessInfo}
              </p>
            </div>
          )}

          {project.startupSteps && (
            <div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-adjustable">
                Passo a Passo para Iniciar
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground text-adjustable leading-relaxed whitespace-pre-line">
                  {project.startupSteps}
                </p>
              </div>
            </div>
          )}

          {project.investmentInfo && (
            <div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-adjustable">
                Informações de Investimento
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-adjustable leading-relaxed">
                  {project.investmentInfo}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.expectedReturn && (
              <div>
                <h4 className="font-semibold text-primary mb-2 text-adjustable">
                  Retorno Esperado
                </h4>
                <p className="text-muted-foreground text-adjustable text-sm">
                  {project.expectedReturn}
                </p>
              </div>
            )}

            {project.timeline && (
              <div>
                <h4 className="font-semibold text-primary mb-2 text-adjustable">
                  Cronograma
                </h4>
                <p className="text-muted-foreground text-adjustable text-sm">
                  {project.timeline}
                </p>
              </div>
            )}

            {project.marketAnalysis && (
              <div>
                <h4 className="font-semibold text-primary mb-2 text-adjustable">
                  Análise de Mercado
                </h4>
                <p className="text-muted-foreground text-adjustable text-sm">
                  {project.marketAnalysis}
                </p>
              </div>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2 text-adjustable">
              Informações do Autor
            </h4>
            <p className="text-muted-foreground text-adjustable">
              <strong>Nome:</strong> {project.author}
            </p>
            <p className="text-muted-foreground text-adjustable">
              <strong>Data de Publicação:</strong> {project.date}
            </p>
            {project.region && (
              <p className="text-muted-foreground text-adjustable">
                <strong>Região:</strong> {project.region}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} className="text-adjustable">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailModal;
