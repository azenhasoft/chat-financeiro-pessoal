import { useState } from 'react';
import { FinanceProvider, useFinance } from '@/context/FinanceContext';
import Onboarding from '@/components/Onboarding';
import ChatInterface from '@/components/ChatInterface';
import Dashboard from '@/components/Dashboard';
import Goals from '@/components/Goals';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, LayoutDashboard, Target, Settings } from 'lucide-react';

type Tab = 'chat' | 'dashboard' | 'goals' | 'settings';

function AppContent() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const { userName } = useFinance();

  if (!hasOnboarded) {
    return <Onboarding onComplete={() => setHasOnboarded(true)} />;
  }

  const tabs = [
    { id: 'chat' as Tab, icon: MessageCircle, label: 'Chat' },
    { id: 'dashboard' as Tab, icon: LayoutDashboard, label: 'Resumo' },
    { id: 'goals' as Tab, icon: Target, label: 'Metas' },
    { id: 'settings' as Tab, icon: Settings, label: 'Config' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-display font-semibold">
              Olá, <span className="gradient-text">{userName || 'Usuário'}</span>
            </h1>
            <p className="text-sm text-muted-foreground">Vamos cuidar das suas finanças?</p>
          </div>
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
            {userName?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'chat' && <ChatInterface />}
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'goals' && <Goals />}
            {activeTab === 'settings' && (
              <div className="p-4">
                <h2 className="text-xl font-display font-semibold mb-4">Configurações</h2>
                <p className="text-muted-foreground">Em breve: preferências, notificações e mais.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border px-2 py-2 z-50">
        <div className="flex justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function Index() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
