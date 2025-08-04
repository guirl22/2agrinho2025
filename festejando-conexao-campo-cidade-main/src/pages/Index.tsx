
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SolutionsSection from "@/components/SolutionsSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import ProjectSubmissionModal from "@/components/ProjectSubmissionModal";
import AdminDashboard from "@/components/AdminDashboard";
import UserLotteryModal from "@/components/UserLotteryModal";
import BlogManagementModal from "@/components/BlogManagementModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [textSize, setTextSize] = useState('medium');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showUserLottery, setShowUserLottery] = useState(false);
  const [showBlogManagement, setShowBlogManagement] = useState(false);
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [approvedProjects, setApprovedProjects] = useState<any[]>([]);
  const [rejectedProjects, setRejectedProjects] = useState<any[]>([]);
  const [isLotteryActive, setIsLotteryActive] = useState(false);
  const [lotteryPrize, setLotteryPrize] = useState('');
  const [lotterySponsor, setLotterySponsor] = useState('');
  const [lotteryNotificationInterval, setLotteryNotificationInterval] = useState(0);
  const [winner, setWinner] = useState<any>(null);
  const [showLotteryNotification, setShowLotteryNotification] = useState(false);
  const [showWinnerNotification, setShowWinnerNotification] = useState(false);
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "O Futuro da Agricultura Conectada",
      excerpt: "Como a tecnologia está revolucionando o campo e aproximando produtores dos centros urbanos.",
      content: "A agricultura conectada representa uma revolução silenciosa que está transformando o modo como produzimos alimentos. Através de sensores IoT, drones e análise de dados, os produtores agora podem monitorar suas culturas em tempo real, otimizando o uso de recursos e maximizando a produtividade.\n\nEssa transformação não apenas beneficia os produtores, mas também os consumidores finais, que têm acesso a alimentos de melhor qualidade e rastreabilidade completa.",
      author: "João Silva",
      date: "2024-01-15",
      category: "Tecnologia",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    },
    {
      id: 2,
      title: "Sustentabilidade no Campo",
      excerpt: "Práticas sustentáveis que beneficiam tanto o meio ambiente quanto a produtividade.",
      content: "A sustentabilidade no campo não é apenas uma tendência, mas uma necessidade urgente. Práticas como rotação de culturas, agricultura regenerativa e uso consciente de recursos hídricos estão se mostrando fundamentais para o futuro do agronegócio.\n\nEstes métodos não apenas preservam o meio ambiente, mas também aumentam a fertilidade do solo e a produtividade a longo prazo.",
      author: "Maria Santos",
      date: "2024-01-10",
      category: "Sustentabilidade",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22"
    }
  ]);
  
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há sorteio ativo e notificações
    const lotteryStatus = localStorage.getItem('lottery_active');
    const currentWinner = localStorage.getItem('lottery_winner');
    const savedPrize = localStorage.getItem('lottery_prize');
    const savedSponsor = localStorage.getItem('lottery_sponsor');
    const savedInterval = localStorage.getItem('lottery_notification_interval');
    
    if (lotteryStatus === 'true') {
      setIsLotteryActive(true);
      setShowLotteryNotification(true);
      if (savedPrize) setLotteryPrize(savedPrize);
      if (savedSponsor) setLotterySponsor(savedSponsor);
      if (savedInterval) setLotteryNotificationInterval(parseInt(savedInterval));
    }
    
    if (currentWinner) {
      const winnerData = JSON.parse(currentWinner);
      setWinner(winnerData);
      setShowWinnerNotification(true);
    }
  }, []);

  // Sistema de notificações com intervalo
  useEffect(() => {
    if (isLotteryActive && lotteryNotificationInterval > 0) {
      const interval = setInterval(() => {
        setShowLotteryNotification(true);
      }, lotteryNotificationInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [isLotteryActive, lotteryNotificationInterval]);

  const handleProjectSubmission = (projectData: any) => {
    const newProject = {
      ...projectData,
      lotteryNumber: isLotteryActive ? Math.floor(Math.random() * 90000) + 10000 : null,
      inLottery: isLotteryActive,
      logs: [
        {
          action: 'project_submitted',
          timestamp: new Date().toISOString(),
          details: 'Projeto submetido para análise',
          userAgent: navigator.userAgent,
          // Nota: IP externo seria obtido via API externa
          ipAddress: 'IP_EXTERNO_AQUI'
        }
      ]
    };
    
    setPendingProjects(prev => [...prev, newProject]);
    console.log('Projeto submetido:', newProject);
  };

  const handleEditProject = (projectData: any) => {
    setPendingProjects(prev => 
      prev.map(p => p.id === projectData.id ? projectData : p)
    );
  };

  const handleApproveProject = (projectId: number) => {
    const project = pendingProjects.find(p => p.id === projectId);
    if (project) {
      const approvedProject = {
        ...project,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'approved',
        inLottery: isLotteryActive,
        logs: [
          ...project.logs,
          {
            action: 'project_approved',
            timestamp: new Date().toISOString(),
            details: 'Projeto aprovado e publicado'
          }
        ]
      };
      
      setApprovedProjects(prev => [...prev, approvedProject]);
      setPendingProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const handleRejectProject = (projectId: number, reason: string) => {
    const project = pendingProjects.find(p => p.id === projectId);
    if (project) {
      const rejectedProject = {
        ...project,
        status: 'rejected',
        rejectionReason: reason,
        logs: [
          ...project.logs,
          {
            action: 'project_rejected',
            timestamp: new Date().toISOString(),
            details: 'Projeto rejeitado',
            reason: reason
          }
        ]
      };
      
      setRejectedProjects(prev => [...prev, rejectedProject]);
      setPendingProjects(prev => prev.filter(p => p.id !== projectId));
      
      toast({
        title: "Projeto Rejeitado",
        description: `Motivo: ${reason}`,
        variant: "destructive"
      });
    }
  };

  const handleStartLottery = (prize: string, sponsor: string, notificationInterval: number) => {
    setIsLotteryActive(true);
    setLotteryPrize(prize);
    setLotterySponsor(sponsor);
    setLotteryNotificationInterval(notificationInterval);
    setShowLotteryNotification(true);
    localStorage.setItem('lottery_active', 'true');
    localStorage.setItem('lottery_prize', prize);
    localStorage.setItem('lottery_sponsor', sponsor);
    localStorage.setItem('lottery_notification_interval', notificationInterval.toString());
    
    setApprovedProjects(prev => 
      prev.map(p => ({ ...p, inLottery: true }))
    );
  };

  const handleStopLottery = () => {
    setIsLotteryActive(false);
    setShowLotteryNotification(false);
    localStorage.setItem('lottery_active', 'false');
    localStorage.removeItem('lottery_prize');
    localStorage.removeItem('lottery_sponsor');
    localStorage.removeItem('lottery_notification_interval');
    
    setApprovedProjects(prev => 
      prev.map(p => ({ ...p, inLottery: false }))
    );
  };

  const handleSelectWinner = (projectId: number) => {
    const winningProject = approvedProjects.find(p => p.id === projectId);
    if (winningProject) {
      setWinner(winningProject);
      setIsLotteryActive(false);
      setShowWinnerNotification(true);
      
      localStorage.setItem('lottery_winner', JSON.stringify(winningProject));
      localStorage.setItem('lottery_active', 'false');
      
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      localStorage.setItem('winner_expiration', expirationDate.toISOString());
    }
  };

  const handleRemoveFromLottery = (projectId: number, reason: string) => {
    setApprovedProjects(prev => 
      prev.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              inLottery: false, 
              removalReason: reason,
              logs: [
                ...p.logs,
                {
                  action: 'removed_from_lottery',
                  timestamp: new Date().toISOString(),
                  details: 'Removido do sorteio',
                  reason: reason
                }
              ]
            } 
          : p
      )
    );
    
    toast({
      title: "Projeto Removido do Sorteio",
      description: `Motivo: ${reason}`,
      variant: "destructive"
    });
  };

  const handleCreateBlogPost = (postData: any) => {
    setBlogPosts(prev => [...prev, postData]);
  };

  const handleEditBlogPost = (postData: any) => {
    setBlogPosts(prev => 
      prev.map(post => post.id === postData.id ? postData : post)
    );
  };

  const handleDeleteBlogPost = (postId: number) => {
    setBlogPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <div className={`min-h-screen bg-background text-size-${textSize}`}>
      {/* Notificação de Sorteio Ativo */}
      {showLotteryNotification && (
        <div className="fixed top-24 right-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg z-40 max-w-sm">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">🎉 Sorteio Ativo!</h4>
              <p className="text-sm">Prêmio: {lotteryPrize}</p>
              {lotterySponsor && (
                <p className="text-xs">Patrocinador: {lotterySponsor}</p>
              )}
              <p className="text-xs">Participe submetendo seu projeto!</p>
            </div>
            <button 
              onClick={() => setShowLotteryNotification(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Notificação de Ganhador */}
      {showWinnerNotification && winner && (
        <div className="fixed top-24 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-40 max-w-sm">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">🏆 Temos um Ganhador!</h4>
              <p className="text-sm">#{winner.lotteryNumber} - {winner.author}</p>
              <p className="text-xs">{winner.title}</p>
            </div>
            <button 
              onClick={() => setShowWinnerNotification(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Header 
        textSize={textSize} 
        setTextSize={setTextSize}
        onShowAdmin={() => setShowAdminDashboard(true)}
        onShowLottery={() => setShowUserLottery(true)}
        onShowBlogManagement={() => setShowBlogManagement(true)}
      />
      
      <HeroSection />
      <SolutionsSection />
      <BlogSection 
        onSubmitProject={() => setShowProjectModal(true)}
        approvedProjects={approvedProjects}
        blogPosts={blogPosts}
      />
      <Footer />

      {showProjectModal && (
        <ProjectSubmissionModal 
          onClose={() => setShowProjectModal(false)}
          onSubmit={handleProjectSubmission}
        />
      )}

      {showAdminDashboard && isAdmin && (
        <AdminDashboard 
          onClose={() => setShowAdminDashboard(false)}
          pendingProjects={pendingProjects}
          approvedProjects={approvedProjects}
          rejectedProjects={rejectedProjects}
          onApproveProject={handleApproveProject}
          onRejectProject={handleRejectProject}
          onEditProject={handleEditProject}
          onStartLottery={handleStartLottery}
          onStopLottery={handleStopLottery}
          onSelectWinner={handleSelectWinner}
          onRemoveFromLottery={handleRemoveFromLottery}
          isLotteryActive={isLotteryActive}
          lotteryPrize={lotteryPrize}
          lotterySponsor={lotterySponsor}
          lotteryNotificationInterval={lotteryNotificationInterval}
          winner={winner}
        />
      )}

      {showUserLottery && user && (
        <UserLotteryModal
          userEmail={user.email}
          onClose={() => setShowUserLottery(false)}
          winner={winner}
          isLotteryActive={isLotteryActive}
        />
      )}

      {showBlogManagement && isAdmin && (
        <BlogManagementModal
          onClose={() => setShowBlogManagement(false)}
          blogPosts={blogPosts}
          onCreatePost={handleCreateBlogPost}
          onEditPost={handleEditBlogPost}
          onDeletePost={handleDeleteBlogPost}
        />
      )}
    </div>
  );
};

export default Index;
