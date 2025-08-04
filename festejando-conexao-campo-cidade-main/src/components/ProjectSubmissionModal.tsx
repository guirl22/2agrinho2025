import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectData {
  title: string;
  description: string;
  author: string;
  email: string;
  image: File | null;
  imagePreview: string | null;
}

export function ProjectSubmissionModal({ isOpen, onClose }: ProjectSubmissionModalProps) {
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    description: '',
    author: '',
    email: '',
    image: null,
    imagePreview: null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProjectData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProjectData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectData.title || !projectData.description || !projectData.author || !projectData.email) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', projectData.title);
    formData.append('description', projectData.description);
    formData.append('author', projectData.author);
    formData.append('email', projectData.email);
    if (projectData.image) {
      formData.append('image', projectData.image);
    }

    // Get existing projects from localStorage
    const existingProjects = JSON.parse(localStorage.getItem('pendingProjects') || '[]');
    
    // Create project object with image data
    const newProject = {
      id: Date.now().toString(),
      title: projectData.title,
      description: projectData.description,
      author: projectData.author,
      email: projectData.email,
      image: projectData.imagePreview, // Store base64 for demo purposes
      status: 'pending',
      submittedAt: new Date().toISOString(),
      participatesInLottery: false // Will be set when lottery is active
    };

    // Add to pending projects
    existingProjects.push(newProject);
    localStorage.setItem('pendingProjects', JSON.stringify(existingProjects));

    toast.success('Projeto enviado com sucesso! Aguarde a aprovação.');
    
    // Reset form
    setProjectData({
      title: '',
      description: '',
      author: '',
      email: '',
      image: null,
      imagePreview: null
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800">
            Enviar Projeto Sustentável
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Título do Projeto *
            </Label>
            <Input
              id="title"
              value={projectData.title}
              onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título do seu projeto"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="author" className="text-sm font-medium text-gray-700">
              Nome do Autor *
            </Label>
            <Input
              id="author"
              value={projectData.author}
              onChange={(e) => setProjectData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Seu nome completo"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={projectData.email}
              onChange={(e) => setProjectData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="seu.email@exemplo.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descrição do Projeto *
            </Label>
            <Textarea
              id="description"
              value={projectData.description}
              onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva seu projeto sustentável, seus objetivos e impacto esperado..."
              className="mt-1 min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Imagem do Projeto
            </Label>
            <div className="mt-2">
              {projectData.imagePreview ? (
                <div className="relative">
                  <img
                    src={projectData.imagePreview}
                    alt="Preview do projeto"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Clique para fazer upload de uma imagem
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PNG, JPG, GIF até 5MB
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Enviar Projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}