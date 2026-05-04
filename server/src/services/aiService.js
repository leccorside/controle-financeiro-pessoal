const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

const generateInsights = async (summaryData, provider = process.env.AI_PROVIDER || 'gemini') => {
  const prompt = `
    Como um assistente financeiro especialista, analise os seguintes dados financeiros do usuário:
    - Receitas Totais: R$ ${summaryData.income.toFixed(2)}
    - Despesas Totais: R$ ${summaryData.expense.toFixed(2)}
    - Investimentos: R$ ${summaryData.investment.toFixed(2)}
    - Saldo do Período: R$ ${summaryData.balance.toFixed(2)}
    - Distribuição de Gastos: ${summaryData.categorySpending.map(c => `${c.name}: R$ ${c.value.toFixed(2)}`).join(', ')}

    Com base nisso, forneça 3 insights curtos (máximo 150 caracteres cada), motivadores e acionáveis para ajudar o usuário.
    IMPORTANTE: Responda APENAS o JSON puro no seguinte formato:
    { "insights": ["frase 1", "frase 2", "frase 3"] }
  `;

  try {
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return JSON.parse(response.choices[0].message.content);
    }

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      // Limpeza básica para garantir que o Gemini não retorne markdown
      const jsonStr = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonStr);
    }

    throw new Error("API Key não configurada para o provedor selecionado.");
  } catch (error) {
    console.error("Erro na geração de insights:", error);
    throw new Error("Falha ao gerar insights da IA.");
  }
};

module.exports = { generateInsights };
