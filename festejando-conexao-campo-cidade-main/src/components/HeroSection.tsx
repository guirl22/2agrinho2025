
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-90"></div>
      
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=3634&q=80')"
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-adjustable animate-fade-in">
          Festejando a Conexão
          <br />
          <span className="text-accent">Campo-Cidade</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-adjustable opacity-90 animate-fade-in">
          Promovendo a interdependência entre o campo e a cidade através de soluções 
          sustentáveis e inovadoras para o agronegócio do futuro.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button 
            size="lg" 
            onClick={() => scrollToSection('solucoes')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-adjustable font-semibold px-8 py-6 border-2 border-white"
          >
            Descobrir Soluções
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => scrollToSection('blog')}
            className="bg-white text-primary border-2 border-white hover:bg-primary hover:text-white text-adjustable font-semibold px-8 py-6"
          >
            Contribuir com Projeto
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
