
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";

interface HeaderProps {
  textSize: string;
  setTextSize: (size: string) => void;
  onShowAdmin: () => void;
  onShowLottery?: () => void;
}

const Header = ({ textSize, setTextSize, onShowAdmin, onShowLottery }: HeaderProps) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CC</span>
            </div>
            <h1 className="text-xl font-bold text-primary text-adjustable">
              Campo-Cidade Conecta
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-adjustable hover:text-primary transition-colors">
              Início
            </a>
            <a href="#solucoes" className="text-adjustable hover:text-primary transition-colors">
              Soluções
            </a>
            <a href="#blog" className="text-adjustable hover:text-primary transition-colors">
              Blog
            </a>
            <a href="#contato" className="text-adjustable hover:text-primary transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-adjustable">
                  Aa {textSize}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border border-border shadow-lg">
                <DropdownMenuItem onClick={() => setTextSize('small')} className="text-adjustable">
                  Texto Pequeno
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTextSize('medium')} className="text-adjustable">
                  Texto Médio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTextSize('large')} className="text-adjustable">
                  Texto Grande
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTextSize('xl')} className="text-adjustable">
                  Texto Extra Grande
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {onShowLottery && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onShowLottery}
                    className="text-adjustable"
                  >
                    Meu Número
                  </Button>
                )}
                
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onShowAdmin}
                    className="text-adjustable"
                  >
                    Admin
                  </Button>
                )}

                <span className="text-adjustable text-sm">Olá, {user?.apelido}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="text-adjustable"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setShowAuthModal(true)}
                className="text-adjustable"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Header;
