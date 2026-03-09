import OpenAI from "openai";

const OPENAI_API_KEY = "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";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface FinancialContext {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  monthlySalary: number;
  categories: { name: string; monthlyBudget?: number }[];
  recentTransactions: { description: string; amount: number; type: string; category: string; date: string }[];
  goals: { name: string; targetAmount: number; currentAmount: number }[];
}

const SYSTEM_PROMPT = `Você é o MoneyFlow AI, um assistente financeiro pessoal inteligente e amigável. 
Você ajuda o usuário a gerenciar suas finanças pessoais, oferecendo:
- Análise de gastos e receitas
- Sugestões de economia e investimento
- Planejamento de orçamento
- Previsões financeiras baseadas em padrões
- Dicas personalizadas baseadas no perfil financeiro do usuário

Regras:
- Sempre responda em português brasileiro
- Seja conciso mas informativo
- Use formatação markdown quando útil
- Quando tiver dados financeiros do usuário, baseie suas respostas neles
- Nunca invente dados, use apenas os fornecidos
- Seja encorajador mas realista
- Use emojis com moderação para tornar a conversa agradável`;

export async function chatWithAI(
  messages: ChatMessage[],
  financialContext?: FinancialContext
): Promise<string> {
  const systemMessages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (financialContext) {
    systemMessages.push({
      role: "system",
      content: `Contexto financeiro atual do usuário:
- Saldo: R$ ${financialContext.balance.toFixed(2)}
- Receita mensal: R$ ${financialContext.totalIncome.toFixed(2)}
- Despesa mensal: R$ ${financialContext.totalExpense.toFixed(2)}
- Economia mensal: R$ ${financialContext.savings.toFixed(2)}
- Salário mensal: R$ ${financialContext.monthlySalary.toFixed(2)}
- Categorias: ${financialContext.categories.map(c => `${c.name}${c.monthlyBudget ? ` (orçamento: R$${c.monthlyBudget})` : ""}`).join(", ")}
- Últimas transações: ${financialContext.recentTransactions.slice(0, 10).map(t => `${t.description}: R$${t.amount} (${t.type}, ${t.category}, ${t.date})`).join("; ")}
- Metas: ${financialContext.goals.map(g => `${g.name}: R$${g.currentAmount}/${g.targetAmount}`).join("; ") || "Nenhuma meta cadastrada"}`,
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [...systemMessages, ...messages],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
}

export async function analyzeSpendingAI(
  transactions: any[],
  categories: any[],
  monthlySalary: number
): Promise<{ score: number; status: string; advice: string; breakdown: Record<string, number> }> {
  const prompt = `Analise a saúde financeira com base nos dados:
Salário: R$${monthlySalary}
Transações: ${JSON.stringify(transactions.slice(0, 50))}
Categorias: ${JSON.stringify(categories)}

Retorne APENAS um JSON válido (sem markdown):
{"score": number 0-100, "status": "Excelente|Bom|Regular|Crítico", "advice": "conselho em pt-BR", "breakdown": {"savings": 0-25, "reserve": 0-20, "distribution": 0-20, "debt": 0-15, "habits": 0-10, "regularity": 0-10}}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 500,
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return { score: 70, status: "Regular", advice: text, breakdown: {} };
  }
}

export async function generateBudgetAdviceAI(
  salary: number,
  profile: any,
  categories: any[]
): Promise<{
  overview: string;
  buckets: { category: string; percentage: number; suggestedAmount: number; reason: string }[];
  categoryAdvice: { categoryId: string; categoryName: string; suggestedAmount: number; advice: string }[];
}> {
  const prompt = `Como consultor financeiro, crie um plano de orçamento para:
Salário: R$${salary}
Perfil: ${JSON.stringify(profile)}
Categorias disponíveis: ${JSON.stringify(categories.map(c => ({ id: c.id, name: c.name })))}

Retorne APENAS JSON válido (sem markdown):
{"overview": "resumo do plano", "buckets": [{"category": "nome", "percentage": num, "suggestedAmount": num, "reason": "motivo"}], "categoryAdvice": [{"categoryId": "id", "categoryName": "nome", "suggestedAmount": num, "advice": "conselho"}]}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 1000,
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return { overview: text, buckets: [], categoryAdvice: [] };
  }
}

export async function generateForecastAI(
  transactions: any[],
  monthlySalary: number,
  categories: any[]
): Promise<{
  summary: string;
  predictions: { month: string; predictedIncome: number; predictedExpense: number; predictedSavings: number }[];
  tips: string[];
  riskAlerts: string[];
}> {
  const prompt = `Com base no histórico financeiro, faça uma previsão para os próximos 3 meses:
Salário: R$${monthlySalary}
Transações (últimos meses): ${JSON.stringify(transactions.slice(0, 60))}
Categorias: ${JSON.stringify(categories.map(c => ({ name: c.name, budget: c.monthlyBudget })))}

Retorne APENAS JSON válido (sem markdown):
{"summary": "resumo da previsão", "predictions": [{"month": "YYYY-MM", "predictedIncome": num, "predictedExpense": num, "predictedSavings": num}], "tips": ["dica1", "dica2"], "riskAlerts": ["alerta1"]}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 800,
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return { summary: text, predictions: [], tips: [], riskAlerts: [] };
  }
}
