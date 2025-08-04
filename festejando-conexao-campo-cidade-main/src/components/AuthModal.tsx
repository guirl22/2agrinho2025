
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login } = useAuth();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [registerForm, setRegisterForm] = useState({
    nomeCompleto: "",
    apelido: "",
    dataNascimento: "",
    celular: "",
    email: "",
    password: "",
    rg: "",
    cpf: "",
    acceptedTerms: false,
    acceptedPrivacy: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginForm.email && loginForm.password) {
      // Verifica se é o email do admin
      const isAdmin = loginForm.email === "cristalsprestes@gmail.com";
      
      login({
        id: isAdmin ? "admin" : "user1",
        nomeCompleto: isAdmin ? "Administrador" : "Usuário",
        apelido: isAdmin ? "Admin" : loginForm.email.split('@')[0],
        email: loginForm.email,
        isAdmin: isAdmin
      });
      toast.success("Login realizado com sucesso!");
      onClose();
    } else {
      toast.error("Por favor, preencha todos os campos");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.acceptedTerms || !registerForm.acceptedPrivacy) {
      toast.error("Você deve aceitar os termos de uso e política de privacidade");
      return;
    }
    
    if (registerForm.nomeCompleto && registerForm.apelido && registerForm.email && registerForm.password) {
      // Verifica se é o email do admin
      const isAdmin = registerForm.email === "cristalsprestes@gmail.com";
      
      login({
        id: isAdmin ? "admin" : "user2",
        nomeCompleto: registerForm.nomeCompleto,
        apelido: registerForm.apelido,
        email: registerForm.email,
        isAdmin: isAdmin
      });
      toast.success("Cadastro realizado com sucesso!");
      onClose();
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-adjustable text-center">Campo-Cidade Conecta</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="text-adjustable">Entrar</TabsTrigger>
              <TabsTrigger value="register" className="text-adjustable">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-adjustable">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="text-adjustable"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-adjustable">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="text-adjustable"
                    required
                  />
                </div>
                <Button type="submit" className="w-full text-adjustable">
                  Entrar
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nomeCompleto" className="text-adjustable">Nome Completo *</Label>
                    <Input
                      id="nomeCompleto"
                      value={registerForm.nomeCompleto}
                      onChange={(e) => setRegisterForm({...registerForm, nomeCompleto: e.target.value})}
                      className="text-adjustable"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="apelido" className="text-adjustable">Apelido *</Label>
                    <Input
                      id="apelido"
                      value={registerForm.apelido}
                      onChange={(e) => setRegisterForm({...registerForm, apelido: e.target.value})}
                      className="text-adjustable"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataNascimento" className="text-adjustable">Data de Nascimento</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={registerForm.dataNascimento}
                      onChange={(e) => setRegisterForm({...registerForm, dataNascimento: e.target.value})}
                      className="text-adjustable"
                    />
                  </div>
                  <div>
                    <Label htmlFor="celular" className="text-adjustable">Celular</Label>
                    <Input
                      id="celular"
                      value={registerForm.celular}
                      onChange={(e) => setRegisterForm({...registerForm, celular: e.target.value})}
                      className="text-adjustable"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="registerEmail" className="text-adjustable">Email *</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="text-adjustable"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="registerPassword" className="text-adjustable">Senha *</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    className="text-adjustable"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rg" className="text-adjustable">RG (opcional)</Label>
                    <Input
                      id="rg"
                      value={registerForm.rg}
                      onChange={(e) => setRegisterForm({...registerForm, rg: e.target.value})}
                      className="text-adjustable"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf" className="text-adjustable">CPF (opcional)</Label>
                    <Input
                      id="cpf"
                      value={registerForm.cpf}
                      onChange={(e) => setRegisterForm({...registerForm, cpf: e.target.value})}
                      className="text-adjustable"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={registerForm.acceptedTerms}
                      onChange={(e) => setRegisterForm({...registerForm, acceptedTerms: e.target.checked})}
                      required
                    />
                    <label htmlFor="terms" className="text-xs text-adjustable">
                      Aceito os{" "}
                      <button 
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-primary hover:underline"
                      >
                        Termos de Uso
                      </button>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={registerForm.acceptedPrivacy}
                      onChange={(e) => setRegisterForm({...registerForm, acceptedPrivacy: e.target.checked})}
                      required
                    />
                    <label htmlFor="privacy" className="text-xs text-adjustable">
                      Aceito a{" "}
                      <button 
                        type="button"
                        onClick={() => setShowPrivacy(true)}
                        className="text-primary hover:underline"
                      >
                        Política de Privacidade
                      </button>
                    </label>
                  </div>
                </div>
                
                <Button type="submit" className="w-full text-adjustable">
                  Cadastrar
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
};

export default AuthModal;
