
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-adjustable">Política de Privacidade</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4 text-adjustable">
            <h3 className="font-semibold text-primary">1. Informações que Coletamos</h3>
            <p className="text-muted-foreground">
              Coletamos informações que você nos fornece diretamente, como quando você 
              cria uma conta, preenche um formulário ou entra em contato conosco. 
              Isso pode incluir nome, email, telefone, RG, CPF e outras informações pessoais.
            </p>

            <h3 className="font-semibold text-primary">2. Como Usamos suas Informações</h3>
            <p className="text-muted-foreground">
              Usamos as informações coletadas para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4">
              <li>Fornecer, operar e manter nosso site</li>
              <li>Melhorar, personalizar e expandir nosso site</li>
              <li>Entender e analisar como você usa nosso site</li>
              <li>Comunicar com você sobre atualizações e ofertas</li>
            </ul>

            <h3 className="font-semibold text-primary">3. Compartilhamento de Informações</h3>
            <p className="text-muted-foreground">
              Não vendemos, trocamos ou transferimos suas informações pessoais para 
              terceiros sem seu consentimento, exceto conforme descrito nesta política 
              ou quando exigido por lei.
            </p>

            <h3 className="font-semibold text-primary">4. Segurança dos Dados</h3>
            <p className="text-muted-foreground">
              Implementamos medidas de segurança adequadas para proteger suas informações 
              pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h3 className="font-semibold text-primary">5. Cookies</h3>
            <p className="text-muted-foreground">
              Nosso site pode usar "cookies" para melhorar a experiência do usuário. 
              Você pode configurar seu navegador para recusar todos os cookies ou 
              indicar quando um cookie está sendo enviado.
            </p>

            <h3 className="font-semibold text-primary">6. Seus Direitos</h3>
            <p className="text-muted-foreground">
              Você tem o direito de acessar, atualizar ou excluir suas informações pessoais. 
              Entre em contato conosco se desejar exercer esses direitos.
            </p>

            <h3 className="font-semibold text-primary">7. Contato</h3>
            <p className="text-muted-foreground">
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato 
              conosco em: prestes.cristal@escola.pr.gov.br
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyModal;
