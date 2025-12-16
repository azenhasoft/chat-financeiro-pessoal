import { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, Calendar, TrendingUp } from 'lucide-react';

export default function Goals() {
  const { goals, addGoal, updateGoal } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '', icon: '🎯' });

  const iconOptions = ['🎯', '✈️', '🏠', '🚗', '📱', '💍', '🎓', '🛡️', '💰', '🏖️'];

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetAmount) {
      addGoal({
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        icon: newGoal.icon,
      });
      setNewGoal({ title: '', targetAmount: '', icon: '🎯' });
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Minhas Metas</h1>
          <p className="text-muted-foreground text-sm">Acompanhe seus objetivos financeiros</p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </Button>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold">Nova Meta</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ícone</label>
                  <div className="flex gap-2 flex-wrap">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewGoal({ ...newGoal, icon })}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                          newGoal.icon === icon
                            ? 'bg-primary/20 border-2 border-primary'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Nome da meta</label>
                  <Input
                    placeholder="Ex: Viagem de férias"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Valor objetivo (R$)</label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  />
                </div>

                <Button
                  variant="gradient"
                  className="w-full"
                  onClick={handleAddGoal}
                  disabled={!newGoal.title || !newGoal.targetAmount}
                >
                  Criar Meta
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl">
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Faltam R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">{progress.toFixed(0)}%</span>
              </div>

              <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full gradient-primary rounded-full"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  R$ {goal.currentAmount.toLocaleString('pt-BR')} / R$ {goal.targetAmount.toLocaleString('pt-BR')}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {goal.deadline.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => updateGoal(goal.id, 100)}
                >
                  + R$ 100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => updateGoal(goal.id, 500)}
                >
                  + R$ 500
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Nenhuma meta criada</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Defina seus objetivos financeiros e acompanhe o progresso
          </p>
          <Button variant="gradient" onClick={() => setIsAdding(true)}>
            Criar primeira meta
          </Button>
        </motion.div>
      )}
    </div>
  );
}
