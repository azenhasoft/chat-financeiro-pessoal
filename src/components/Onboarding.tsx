import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinance } from '@/context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wallet, Target, MessageCircle, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Wallet,
    title: 'Controle seus gastos',
    description: 'Registre suas despesas de forma natural, apenas conversando.',
  },
  {
    icon: Target,
    title: 'Alcance suas metas',
    description: 'Defina objetivos financeiros e acompanhe seu progresso.',
  },
  {
    icon: MessageCircle,
    title: 'Dicas personalizadas',
    description: 'Receba orientações inteligentes para economizar mais.',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const { setUserName } = useFinance();

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else if (name.trim()) {
      setUserName(name.trim());
      onComplete();
    }
  };

  const handleSkip = () => {
    if (step < steps.length) {
      setStep(steps.length);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {step < steps.length ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mb-8 shadow-glow"
            >
              {(() => {
                const Icon = steps[step].icon;
                return <Icon className="w-12 h-12 text-primary-foreground" />;
              })()}
            </motion.div>

            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              {steps[step].title}
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              {steps[step].description}
            </p>

            <div className="flex gap-2 mb-8">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-4 w-full">
              <Button variant="ghost" onClick={handleSkip} className="flex-1">
                Pular
              </Button>
              <Button variant="gradient" onClick={handleNext} className="flex-1">
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mb-8 shadow-glow"
            >
              <Sparkles className="w-12 h-12 text-primary-foreground" />
            </motion.div>

            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Vamos começar!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Como posso te chamar?
            </p>

            <Input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-6 text-center text-lg"
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleNext()}
            />

            <Button
              variant="gradient"
              size="xl"
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full"
            >
              Começar minha jornada
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
