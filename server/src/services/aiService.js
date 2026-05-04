const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

const generateInsights = async (summaryData, providerRaw = process.env.AI_PROVIDER || 'gemini') => {
  const provider = providerRaw.toLowerCase().trim();
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
    console.log(`[AI Debug] Provedor selecionado: "${provider}"`);
    
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      const apiKey = process.env.OPENAI_API_KEY.trim().replace(/^"|"$/g, '');
      const openai = new OpenAI({ apiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return JSON.parse(response.choices[0].message.content);
    }

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const apiKey = process.env.GEMINI_API_KEY.trim().replace(/^"|"$/g, '');
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Tentativa de listar modelos para diagnóstico
      try {
        const modelsList = await genAI.listModels();
        console.log("[AI Debug] Modelos disponíveis para esta chave:", modelsList.models.map(m => m.name).join(', '));
      } catch (e) {
        console.error("[AI Debug] Não foi possível listar modelos:", e.message);
      }

      console.log(`[AI] Gerando insights com Gemini (Modelo: gemini-1.5-flash)`);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let result;
      try {
        result = await model.generateContent(prompt);
      } catch (geminiError) {
        console.error("[Gemini API Error Detail]:", geminiError);
        throw geminiError;
      }
      
      const response = await result.response;
      const text = response.text();
      const jsonStr = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonStr);
    }

    if (provider === 'groq' && process.env.GROQ_API_KEY) {
      const apiKey = process.env.GROQ_API_KEY.trim().replace(/^"|"$/g, '');
      const groq = new OpenAI({ 
        apiKey,
        baseURL: "https://api.groq.com/openai/v1"
      });
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return JSON.parse(response.choices[0].message.content);
    }

    throw new Error("API Key não configurada para o provedor selecionado.");
  } catch (error) {
    console.error("Erro na geração de insights:", error);
    
    if (error.message?.includes('insufficient_quota') || error.code === 'insufficient_quota') {
      return { 
        insights: ["Cota da API IA excedida. Verifique seus créditos ou mude o provedor no arquivo .env."],
        status: 'quota_exceeded'
      };
    }

    throw new Error("Falha ao gerar insights da IA. Verifique sua conexão e chaves de API.");
  }
};

module.exports = { generateInsights };
