
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserLotteryModalProps {
  userEmail: string;
  onClose: () => void;
  winner: any;
  isLotteryActive: boolean;
}

const UserLotteryModal = ({ userEmail, onClose, winner, isLotteryActive }: UserLotteryModalProps) => {
  const [lotteryNumber, setLotteryNumber] = useState<string | null>(null);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    // Buscar número do sorteio do localStorage
    const number = localStorage.getItem(`lottery_${userEmail}`);
    setLotteryNumber(number);

    // Verificar se é o ganhador
    if (winner && winner.email === userEmail) {
      setIsWinner(true);
    }
  }, [userEmail, winner]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-primary text-adjustable">
                {isWinner ? '🏆 Parabéns!' : 'Meu Número do Sorteio'}
              </CardTitle>
              <CardDescription className="text-adjustable">
                {isWinner ? 'Você foi o ganhador!' : 'Seu número de participação'}
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
        
        <CardContent className="space-y-4">
          {isWinner ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
              <div className="text-6xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Você Ganhou!
              </h3>
              <p className="text-green-700 mb-4">
                Seu projeto foi selecionado como ganhador do sorteio!
              </p>
              <Badge className="bg-green-600 text-white mb-4">
                Número Ganhador: {lotteryNumber}
              </Badge>
              <div className="bg-white p-3 rounded border">
                <h4 className="font-semibold text-green-800 mb-2">Como Resgatar:</h4>
                <ol className="text-sm text-green-700 text-left space-y-1">
                  <li>1. Entre em contato conosco via email</li>
                  <li>2. Informe seu número do sorteio: {lotteryNumber}</li>
                  <li>3. Aguarde confirmação e instruções</li>
                  <li>4. Resgate disponível por 30 dias</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {lotteryNumber ? (
                <div>
                  <div className="bg-primary/10 p-6 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Seu Número
                    </h3>
                    <div className="text-4xl font-bold text-primary">
                      #{lotteryNumber}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Badge variant={isLotteryActive ? "default" : "secondary"}>
                      {isLotteryActive ? 'Sorteio Ativo' : 'Aguardando Sorteio'}
                    </Badge>
                    
                    <p className="text-sm text-muted-foreground">
                      {isLotteryActive 
                        ? 'Seu projeto está participando do sorteio atual!'
                        : 'Você receberá uma notificação quando um sorteio for iniciado.'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <p className="text-muted-foreground text-adjustable">
                    Você ainda não submeteu nenhum projeto.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Submeta um projeto para receber um número do sorteio!
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <Button onClick={onClose} className="text-adjustable">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLotteryModal;
