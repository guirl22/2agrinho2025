
import { useState } from "react";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer id="contato" className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-foreground text-primary rounded-full flex items-center justify-center">
                  <span className="font-bold text-sm">CC</span>
                </div>
                <h3 className="text-xl font-bold text-adjustable">Campo-Cidade Conecta</h3>
              </div>
              <p className="text-primary-foreground/80 text-adjustable">
                Conectando campo e cidade através de soluções sustentáveis e inovadoras 
                para um futuro melhor.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-adjustable">Soluções</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <button 
                    onClick={() => scrollToSection('solucoes')}
                    className="hover:text-primary-foreground transition-colors text-adjustable text-left"
                  >
                    Criação de Equinos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solucoes')}
                    className="hover:text-primary-foreground transition-colors text-adjustable text-left"
                  >
                    Suinocultura
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solucoes')}
                    className="hover:text-primary-foreground transition-colors text-adjustable text-left"
                  >
                    Avicultura
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solucoes')}
                    className="hover:text-primary-foreground transition-colors text-adjustable text-left"
                  >
                    Piscicultura
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-adjustable">Comunidade</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <button 
                    onClick={() => scrollToSection('blog')}
                    className="hover:text-primary-foreground transition-colors text-adjustable text-left"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('blog')}
                    className="hover:text-primary-foreground transition-colors text-adjustable text-left"
                  >
                    Projetos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solucoes')}
                    className="hover:text-primary-foreground transition-colors text-adjustable text-left"
                  >
                    Agricultura Familiar
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solucoes')}
                    className="hover:text-primary-foreground transition-colors text-adjustable text-left"
                  >
                    Feiras Locais
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-adjustable">Contato</h4>
              <div className="space-y-2 text-primary-foreground/80">
                <p className="text-adjustable">prestes.cristal@escola.pr.gov.br</p>
                <p className="text-adjustable">Telêmaco Borba, PR</p>
                <p className="text-adjustable">Paraná, Brasil</p>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-primary-foreground/60 text-sm text-adjustable">
                © 2024 Campo-Cidade Conecta. Todos os direitos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <button 
                  onClick={() => setShowPrivacy(true)}
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-adjustable"
                >
                  Política de Privacidade
                </button>
                <button 
                  onClick={() => setShowTerms(true)}
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-adjustable"
                >
                  Termos de Uso
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
};

export default Footer;
