
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import ProjectDetailModal from "./ProjectDetailModal";
import BlogPostModal from "./BlogPostModal";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";

interface BlogSectionProps {
  onSubmitProject: () => void;
  approvedProjects: any[];
  blogPosts: any[];
}

const BlogSection = ({ onSubmitProject, approvedProjects, blogPosts }: BlogSectionProps) => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmitClick = () => {
    if (isAuthenticated) {
      onSubmitProject();
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section id="blog" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4 text-adjustable">
              Blog e Projetos
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-adjustable">
              Fique por dentro das últimas novidades e conheça projetos inovadores
            </p>
            <Button 
              size="lg" 
              onClick={handleSubmitClick}
              className="text-adjustable"
            >
              {isAuthenticated ? "Submeter Projeto" : "Fazer Login para Submeter Projeto"}
            </Button>
          </div>

          {/* Projetos Aprovados */}
          {approvedProjects.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-primary mb-8 text-center text-adjustable">
                Projetos Aprovados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {approvedProjects.map((project) => (
                  <Card key={project.id} className="group hover:shadow-lg transition-shadow bg-card border-border">
                    {project.image && (
                      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="text-adjustable">
                          {project.category}
                        </Badge>
                        {project.inLottery && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 text-adjustable">
                            No Sorteio #{project.lotteryNumber}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors text-adjustable">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-adjustable">
                        {project.description.length > 100 
                          ? `${project.description.substring(0, 100)}...` 
                          : project.description
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="text-adjustable">{project.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-adjustable">{project.date || project.submittedAt}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-adjustable"
                        onClick={() => setSelectedProject(project)}
                      >
                        Ver Detalhes
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Posts do Blog */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-8 text-center text-adjustable">
              Últimas Novidades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-shadow bg-card border-border">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-primary/60 text-lg font-medium">Blog</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit text-adjustable">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors text-adjustable">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-adjustable">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span className="text-adjustable">{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-adjustable">{post.date}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-adjustable"
                      onClick={() => setSelectedBlogPost(post)}
                    >
                      Ler Mais
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {selectedBlogPost && (
        <BlogPostModal
          post={selectedBlogPost}
          onClose={() => setSelectedBlogPost(null)}
        />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default BlogSection;
