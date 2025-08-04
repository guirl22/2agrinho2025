import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, User, Mail, Gift, X, Image as ImageIcon } from 'lucide-react';

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

interface SolutionDetailModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function SolutionDetailModal({ project, isOpen, onClose }: SolutionDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-2xl font-bold text-green-800 pr-8">
              {project.title}
            </DialogTitle>
            <div className="flex gap-2 flex-shrink-0">
              {project.participatesInLottery && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Gift className="h-3 w-3 mr-1" />
                  Participa do Sorteio
                </Badge>
              )}
              <Badge variant="default" className="bg-green-100 text-green-800">
                Aprovado
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagem do projeto */}
          {project.image ? (
            <div className="w-full">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg border shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-64 md:h-80 bg-gray-100 rounded-lg border flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                  <p>Imagem não disponível</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-64 md:h-80 bg-gray-100 rounded-lg border flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                <p>Nenhuma imagem fornecida</p>
              </div>
            </div>
          )}

          {/* Informações do autor */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Informações do Projeto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Autor</p>
                  <p className="font-medium">{project.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{project.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Data de Submissão</p>
                  <p className="font-medium">
                    {new Date(project.submittedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              {project.approvedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Data de Aprovação</p>
                    <p className="font-medium text-green-700">
                      {new Date(project.approvedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Descrição do projeto */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Descrição do Projeto</h3>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </div>

          {/* Status do sorteio */}
          {project.participatesInLottery && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Participação no Sorteio</h3>
              </div>
              <p className="text-yellow-700 text-sm">
                Este projeto está participando do sorteio atual e concorre aos prêmios disponíveis.
              </p>
            </div>
          )}

          {/* Botão de fechar */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}