
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BlogManagementModalProps {
  onClose: () => void;
  blogPosts: any[];
  onCreatePost: (postData: any) => void;
  onEditPost: (postData: any) => void;
  onDeletePost: (postId: number) => void;
}

const BlogManagementModal = ({ 
  onClose, 
  blogPosts, 
  onCreatePost, 
  onEditPost, 
  onDeletePost 
}: BlogManagementModalProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    image: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!formData.title || !formData.excerpt || !formData.category || !formData.author) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const postData = {
      ...formData,
      id: editingPost ? editingPost.id : Date.now(),
      date: new Date().toLocaleDateString('pt-BR')
    };

    if (editingPost) {
      onEditPost(postData);
      toast({
        title: "Post Atualizado",
        description: "O post foi atualizado com sucesso.",
      });
    } else {
      onCreatePost(postData);
      toast({
        title: "Post Criado",
        description: "O post foi criado com sucesso.",
      });
    }

    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      image: ''
    });
    setShowCreateForm(false);
    setEditingPost(null);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || '',
      category: post.category,
      author: post.author,
      image: post.image || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = (postId: number) => {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      onDeletePost(postId);
      toast({
        title: "Post Excluído",
        description: "O post foi excluído com sucesso.",
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
                Gerenciar Blog
              </CardTitle>
              <CardDescription className="text-adjustable">
                Crie, edite e gerencie as postagens do blog.
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary text-adjustable">
              Posts do Blog ({blogPosts.length})
            </h3>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="text-adjustable"
            >
              Criar Novo Post
            </Button>
          </div>

          {showCreateForm && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg text-adjustable">
                  {editingPost ? 'Editar Post' : 'Criar Novo Post'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-adjustable">Título *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Título do post..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-adjustable">Categoria *</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="Ex: Tecnologia, Sustentabilidade..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-adjustable">Autor *</label>
                    <Input
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      placeholder="Nome do autor..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-adjustable">URL da Imagem</label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-adjustable">Resumo *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    rows={3}
                    placeholder="Resumo do post que aparecerá na listagem..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-adjustable">Conteúdo Completo</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    rows={8}
                    placeholder="Conteúdo completo do post..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingPost(null);
                      setFormData({
                        title: '',
                        excerpt: '',
                        content: '',
                        category: '',
                        author: '',
                        image: ''
                      });
                    }}
                    className="text-adjustable"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="text-adjustable"
                  >
                    {editingPost ? 'Atualizar' : 'Criar'} Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post) => (
              <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm text-adjustable line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-adjustable text-xs">
                    Por {post.author} • {post.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                      className="flex-1 text-xs"
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                      className="text-xs"
                    >
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagementModal;
