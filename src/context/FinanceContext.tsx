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

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', description: 'Salário', amount: 5000, category: 'salário', date: new Date(), type: 'income' },
    { id: '2', description: 'Almoço no iFood', amount: 35, category: 'alimentação', date: new Date(), type: 'expense' },
    { id: '3', description: 'Uber para o trabalho', amount: 22, category: 'transporte', date: new Date(), type: 'expense' },
    { id: '4', description: 'Netflix mensal', amount: 39.90, category: 'lazer', date: new Date(), type: 'expense' },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Reserva de emergência', targetAmount: 15000, currentAmount: 4500, deadline: new Date('2025-12-31'), icon: '🛡️' },
    { id: '2', title: 'Viagem de férias', targetAmount: 8000, currentAmount: 2200, deadline: new Date('2025-07-01'), icon: '✈️' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Olá! 👋 Sou seu assistente financeiro. Posso te ajudar a registrar gastos, acompanhar metas e dar dicas de economia. Experimente me dizer algo como "gastei 50 reais no almoço" ou "quanto gastei esse mês?"`,
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);

  const balance = transactions.reduce((acc, t) => 
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0
  );

  const monthlyBudget = 3000;

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const category = transaction.category || categorizeExpense(transaction.description);
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      category,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]);
  };

  const updateGoal = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
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

export { categoryIcons, categorizeExpense };
