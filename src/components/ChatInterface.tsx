import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinance, categorizeExpense, categoryIcons, isCurrentMonth } from '@/context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

const parseExpense = (text: string): { amount: number; description: string } | null => {
  const patterns = [
    /(?:gastei|paguei|comprei|custou)\s*(?:R\$?\s*)?(\d+(?:[,.]\d{2})?)\s*(?:reais?)?\s*(?:em|no|na|de|com)?\s*(.+)/i,
    /(\d+(?:[,.]\d{2})?)\s*(?:reais?)?\s*(?:em|no|na|de|com)\s*(.+)/i,
    /(.+)\s*(?:custou|foi)\s*(?:R\$?\s*)?(\d+(?:[,.]\d{2})?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const [, first, second] = match;
      const amount = parseFloat(first.replace(',', '.'));
      if (!isNaN(amount)) {
        return { amount, description: second?.trim() || 'Gasto' };
      }
      const amount2 = parseFloat(second?.replace(',', '.') || '');
      if (!isNaN(amount2)) {
        return { amount: amount2, description: first?.trim() || 'Gasto' };
      }
    }
  }
  return null;
};

const generateResponse = (userMessage: string, context: ReturnType<typeof useFinance>): string => {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('quanto gastei') || lower.includes('meus gastos')) {
    const monthlyExpenses = context.transactions
      .filter(t => t.type === 'expense' && isCurrentMonth(t.date))
      .reduce((sum, t) => sum + t.amount, 0);
    return `📊 Esse mês você já gastou **R$ ${monthlyExpenses.toFixed(2)}**. Seu saldo atual é de **R$ ${context.balance.toFixed(2)}**. Quer que eu detalhe por categoria?`;
  }
  
  if (lower.includes('categoria') || lower.includes('onde gastei')) {
    const byCategory = context.transactions
      .filter(t => t.type === 'expense' && isCurrentMonth(t.date))
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    const details = Object.entries(byCategory)
      .sort(([,a], [,b]) => b - a)
      .map(([cat, val]) => `${categoryIcons[cat] || '📦'} ${cat}: R$ ${val.toFixed(2)}`)
      .join('\n');
    
    return `📋 Seus gastos por categoria:\n\n${details}`;
  }

  if (lower.includes('meta') || lower.includes('objetivo')) {
    if (context.goals.length === 0) {
      return '🎯 Você ainda não tem metas definidas. Quer criar uma? Me diz o que você quer alcançar!';
    }
    const goalsList = context.goals
      .map(g => `${g.icon} ${g.title}: ${((g.currentAmount / g.targetAmount) * 100).toFixed(0)}% concluído`)
      .join('\n');
    return `🎯 Suas metas:\n\n${goalsList}\n\nContinue assim! 💪`;
  }

  if (lower.includes('dica') || lower.includes('economizar')) {
    const tips = [
      '💡 Que tal definir um dia da semana para não gastar nada? Pequenas economias fazem grande diferença!',
      '💡 Se delivery pesa no seu orçamento, compare quanto você gasta no mês com alternativas como cozinhar ou levar comida de casa.',
      '💡 Revise suas assinaturas mensais. Muitas vezes pagamos por serviços que não usamos.',
      '💡 A regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para poupança.',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  if (lower.includes('olá') || lower.includes('oi') || lower.includes('bom dia') || lower.includes('boa tarde')) {
    return `Olá${context.userName ? `, ${context.userName}` : ''}! 😊 Como posso te ajudar com suas finanças hoje?`;
  }

  return '🤔 Não entendi completamente. Tente me dizer algo como "gastei 50 reais no almoço" ou pergunte "quanto gastei esse mês?"';
};

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const finance = useFinance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [finance.messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    finance.addMessage({ content: userMessage, sender: 'user' });
    setIsTyping(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    const expense = parseExpense(userMessage);
    
    if (expense) {
      const category = categorizeExpense(expense.description);
      finance.addTransaction({
        description: expense.description,
        amount: expense.amount,
        category,
        date: new Date(),
        type: 'expense',
      });

      finance.addMessage({
        content: `✅ Registrado! ${categoryIcons[category]} **${expense.description}** - R$ ${expense.amount.toFixed(2)} (${category})\n\nSeu saldo atual: R$ ${(finance.balance - expense.amount).toFixed(2)}`,
        sender: 'assistant',
      });
    } else {
      const response = generateResponse(userMessage, finance);
      finance.addMessage({ content: response, sender: 'assistant' });
    }

    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {finance.messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'gradient-primary text-primary-foreground rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content.split('**').map((part, i) => 
                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                  )}
                </p>
                <span className={`text-xs mt-1 block ${
                  message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Quanto gastei?', 'Ver metas', 'Dica de economia'].map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => {
                setInput(action);
              }}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            placeholder="Digite ou diga 'gastei 50 no almoço'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            variant="gradient"
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
