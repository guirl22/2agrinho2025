
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectLogsModalProps {
  project: any;
  onClose: () => void;
}

const ProjectLogsModal = ({ project, onClose }: ProjectLogsModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-primary text-adjustable">
                Logs do Projeto #{project.lotteryNumber}
              </CardTitle>
              <CardDescription className="text-adjustable">
                {project.title} - Por {project.author}
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
          {/* Informações do Sistema */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-3 text-adjustable">
              Informações do Sistema
            </h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>IP:</strong> {project.systemInfo?.ip || 'N/A'}
                </div>
                <div>
                  <strong>Sistema:</strong> {project.systemInfo?.platform || 'N/A'}
                </div>
                <div>
                  <strong>Navegador:</strong> {project.systemInfo?.userAgent?.split(' ')[0] || 'N/A'}
                </div>
                <div>
                  <strong>Resolução:</strong> {project.systemInfo?.screenResolution || 'N/A'}
                </div>
                <div>
                  <strong>Idioma:</strong> {project.systemInfo?.language || 'N/A'}
                </div>
                <div>
                  <strong>Fuso Horário:</strong> {project.systemInfo?.timezone || 'N/A'}
                </div>
                <div>
                  <strong>Hostname:</strong> {project.systemInfo?.hostname || 'N/A'}
                </div>
                <div>
                  <strong>Data/Hora:</strong> {formatDate(project.systemInfo?.timestamp || '')}
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Localização */}
          {project.locationData && (
            <div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-adjustable">
                Localização
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Latitude:</strong> {project.locationData.latitude?.toFixed(6)}
                  </div>
                  <div>
                    <strong>Longitude:</strong> {project.locationData.longitude?.toFixed(6)}
                  </div>
                  <div>
                    <strong>Precisão:</strong> {project.locationData.accuracy?.toFixed(0)}m
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Histórico de Ações */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-3 text-adjustable">
              Histórico de Ações
            </h3>
            <div className="space-y-3">
              {project.logs?.map((log: any, index: number) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={
                      log.action === 'project_submitted' ? 'default' :
                      log.action === 'project_edited' ? 'secondary' :
                      log.action === 'project_approved' ? 'outline' :
                      log.action === 'project_rejected' ? 'destructive' :
                      'default'
                    }>
                      {log.action.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {log.details}
                  </p>
                  {log.reason && (
                    <p className="text-sm text-red-600 mt-1">
                      <strong>Motivo:</strong> {log.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
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

export default ProjectLogsModal;
