
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface BlogPostModalProps {
  post: {
    id: number;
    title: string;
    excerpt: string;
    content?: string;
    author: string;
    date: string;
    category: string;
    image?: string;
  };
  onClose: () => void;
}

const BlogPostModal = ({ post, onClose }: BlogPostModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl text-primary text-adjustable">
                  {post.title}
                </CardTitle>
                <Badge variant="outline">{post.category}</Badge>
              </div>
              <CardDescription className="text-adjustable flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
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
          {post.image && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <p className="text-muted-foreground text-adjustable leading-relaxed mb-4">
              {post.excerpt}
            </p>
            
            {post.content ? (
              <div className="prose prose-gray max-w-none">
                <div className="text-foreground text-adjustable leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>
              </div>
            ) : (
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground text-adjustable">
                  Conteúdo completo em breve...
                </p>
              </div>
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

export default BlogPostModal;
