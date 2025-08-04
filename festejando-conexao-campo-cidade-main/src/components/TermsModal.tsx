
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-adjustable">Termos de Uso</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4 text-adjustable">
            <h3 className="font-semibold text-primary">1. Aceitação dos Termos</h3>
            <p className="text-muted-foreground">
              Ao acessar e usar este site, você aceita estar vinculado a estes termos de uso, 
              todas as leis e regulamentos aplicáveis, e concorda que é responsável pelo 
              cumprimento de todas as leis locais aplicáveis.
            </p>

            <h3 className="font-semibold text-primary">2. Uso da Licença</h3>
            <p className="text-muted-foreground">
              É concedida permissão para baixar temporariamente uma cópia dos materiais 
              no site Campo-Cidade Conecta apenas para visualização transitória pessoal 
              e não comercial.
            </p>

            <h3 className="font-semibold text-primary">3. Isenção de Responsabilidade</h3>
            <p className="text-muted-foreground">
              Os materiais no site da Campo-Cidade Conecta são fornecidos "como estão". 
              Campo-Cidade Conecta não oferece garantias, expressas ou implícitas, e por 
              este meio se isenta e nega todas as outras garantias.
            </p>

            <h3 className="font-semibold text-primary">4. Limitações</h3>
            <p className="text-muted-foreground">
              Em nenhum caso a Campo-Cidade Conecta ou seus fornecedores serão responsáveis 
              por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou 
              lucro, ou devido à interrupção dos negócios).
            </p>

            <h3 className="font-semibold text-primary">5. Precisão dos Materiais</h3>
            <p className="text-muted-foreground">
              Os materiais exibidos no site da Campo-Cidade Conecta podem incluir erros 
              técnicos, tipográficos ou fotográficos. Campo-Cidade Conecta não garante 
              que qualquer material em seu site seja preciso, completo ou atual.
            </p>

            <h3 className="font-semibold text-primary">6. Modificações</h3>
            <p className="text-muted-foreground">
              A Campo-Cidade Conecta pode revisar estes termos de uso do site a qualquer 
              momento, sem aviso prévio. Ao usar este site, você concorda em estar vinculado 
              à versão atual destes termos de uso.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
