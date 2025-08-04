
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ProjectEditModalProps {
  project: any;
  onClose: () => void;
  onSave: (projectData: any) => void;
}

const ProjectEditModal = ({ project, onClose, onSave }: ProjectEditModalProps) => {
  const [formData, setFormData] = useState({
    title: project.title || '',
    description: project.description || '',
    author: project.author || '',
    email: project.email || '',
    category: project.category || '',
    businessInfo: project.businessInfo || '',
    startupSteps: project.startupSteps || '',
    investmentInfo: project.investmentInfo || '',
    marketAnalysis: project.marketAnalysis || '',
    expectedReturn: project.expectedReturn || '',
    timeline: project.timeline || '',
    region: project.region || ''
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProject = {
      ...project,
      ...formData,
      logs: [
        ...project.logs,
        {
          action: 'project_edited',
          timestamp: new Date().toISOString(),
          details: 'Projeto editado pelo administrador'
        }
      ]
    };
    
    onSave(updatedProject);
    
    toast({
      title: "Projeto Atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-primary text-adjustable">
                Editar Projeto #{project.lotteryNumber}
              </CardTitle>
              <CardDescription className="text-adjustable">
                Faça as alterações necessárias antes de aprovar ou rejeitar.
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
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author" className="text-adjustable">Nome do Autor</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-adjustable">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-2"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-adjustable">Título do Projeto</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="region" className="text-adjustable">Região/Estado</Label>
                <Input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="text-adjustable">Categoria</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="">Selecione uma categoria</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="sustentabilidade">Sustentabilidade</option>
                <option value="cooperativismo">Cooperativismo</option>
                <option value="inovacao">Inovação</option>
                <option value="energia">Energia Renovável</option>
                <option value="logistica">Logística</option>
              </select>
            </div>

            <div>
              <Label htmlFor="description" className="text-adjustable">Descrição do Projeto</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="businessInfo" className="text-adjustable">Informações sobre o Negócio</Label>
              <Textarea
                id="businessInfo"
                name="businessInfo"
                value={formData.businessInfo}
                onChange={handleInputChange}
                rows={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="startupSteps" className="text-adjustable">Passo a Passo para Iniciar</Label>
              <Textarea
                id="startupSteps"
                name="startupSteps"
                value={formData.startupSteps}
                onChange={handleInputChange}
                rows={4}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investmentInfo" className="text-adjustable">Informações de Investimento</Label>
                <Textarea
                  id="investmentInfo"
                  name="investmentInfo"
                  value={formData.investmentInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="expectedReturn" className="text-adjustable">Retorno Esperado</Label>
                <Textarea
                  id="expectedReturn"
                  name="expectedReturn"
                  value={formData.expectedReturn}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeline" className="text-adjustable">Cronograma</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="marketAnalysis" className="text-adjustable">Análise de Mercado</Label>
                <Input
                  id="marketAnalysis"
                  name="marketAnalysis"
                  value={formData.marketAnalysis}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="text-adjustable">
                Cancelar
              </Button>
              <Button type="submit" className="text-adjustable">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectEditModal;
