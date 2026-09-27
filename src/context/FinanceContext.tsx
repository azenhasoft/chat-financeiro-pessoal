import { createContext, useContext, useState, ReactNode } from 'react';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  type: 'expense' | 'income';
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  icon: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  transaction?: Transaction;
}

interface FinanceContextType {
  transactions: Transaction[];
  goals: Goal[];
  messages: Message[];
  balance: number;
  monthlyBudget: number;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, amount: number) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const categoryIcons: Record<string, string> = {
  alimentação: '🍔',
  transporte: '🚗',
  lazer: '🎮',
  saúde: '💊',
  educação: '📚',
  moradia: '🏠',
  compras: '🛒',
  outros: '📦',
  salário: '💰',
  freelance: '💼',
};

const categorizeExpense = (description: string): string => {
  const lower = description.toLowerCase();
  if (lower.includes('uber') || lower.includes('ônibus') || lower.includes('gasolina') || lower.includes('metro')) return 'transporte';
  if (lower.includes('almoço') || lower.includes('jantar') || lower.includes('ifood') || lower.includes('mercado') || lower.includes('café')) return 'alimentação';
  if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('cinema') || lower.includes('jogo')) return 'lazer';
  if (lower.includes('farmácia') || lower.includes('médico') || lower.includes('academia')) return 'saúde';
  if (lower.includes('curso') || lower.includes('livro') || lower.includes('escola')) return 'educação';
  if (lower.includes('aluguel') || lower.includes('conta') || lower.includes('luz') || lower.includes('internet')) return 'moradia';
  if (lower.includes('roupa') || lower.includes('loja') || lower.includes('presente')) return 'compras';
  return 'outros';
};

const isCurrentMonth = (date: Date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! 👋 Este protótipo usa regras locais para registrar gastos e responder algumas perguntas. Experimente dizer "gastei 50 reais no almoço" ou perguntar "quanto gastei esse mês?".',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);

  const balance = transactions.reduce(
    (acc, transaction) => transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount,
    0
  );

  const monthlyBudget = 3000;

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const category = transaction.category || categorizeExpense(transaction.description);
    setTransactions(prev => [
      { ...transaction, id: Date.now().toString(), category },
      ...prev,
    ]);
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]);
  };

  const updateGoal = (id: string, amount: number) => {
    if (amount <= 0) return;
    setGoals(prev => prev.map(goal =>
      goal.id === id
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    ));
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...message, id: Date.now().toString(), timestamp: new Date() }]);
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      goals,
      messages,
      balance,
      monthlyBudget,
      addTransaction,
      addGoal,
      updateGoal,
      addMessage,
      userName,
      setUserName,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

export { categoryIcons, categorizeExpense, isCurrentMonth };
