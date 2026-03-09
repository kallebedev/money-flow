import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { generateForecastAI } from "@/lib/openaiService";
import { TrendingUp, AlertTriangle, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIForecast() {
  const { transactions, monthlySalary, categories } = useFinance();
  const [forecast, setForecast] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateForecast = async () => {
    if (transactions.length === 0) {
      setError("Registre algumas transações primeiro para gerar previsões.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateForecastAI(
        transactions.map(t => ({
          ...t,
          categoryName: categories.find(c => c.id === t.category)?.name || t.category
        })),
        monthlySalary,
        categories
      );
      setForecast(result);
    } catch (err: any) {
      setError("Erro ao gerar previsão. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/40 border border-white/[0.03] rounded-[24px] shadow-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Previsão Financeira IA</CardTitle>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Próximos 3 meses</p>
            </div>
          </div>
          <Button
            onClick={generateForecast}
            disabled={isLoading}
            variant="outline"
            className="h-9 px-4 rounded-xl border-primary/10 text-primary font-bold text-[11px] uppercase tracking-wider gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isLoading ? "Analisando..." : forecast ? "Atualizar" : "Gerar Previsão"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{error}</p>
        )}

        {!forecast && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Clique em "Gerar Previsão" para a IA analisar suas tendências financeiras</p>
          </div>
        )}

        {forecast && (
          <>
            <p className="text-sm text-foreground/80 leading-relaxed italic">"{forecast.summary}"</p>

            {/* Predictions Table */}
            {forecast.predictions?.length > 0 && (
              <div className="rounded-xl border border-white/[0.04] overflow-hidden">
                <div className="grid grid-cols-4 bg-white/[0.03] px-4 py-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Mês</span>
                  <span className="text-right">Receita</span>
                  <span className="text-right">Despesa</span>
                  <span className="text-right">Economia</span>
                </div>
                {forecast.predictions.map((p: any, i: number) => (
                  <div key={i} className="grid grid-cols-4 px-4 py-3 text-sm border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <span className="font-medium text-foreground/70">{p.month}</span>
                    <span className="text-right font-mono text-primary">
                      {p.predictedIncome?.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-right font-mono text-destructive">
                      {p.predictedExpense?.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                    </span>
                    <span className={cn("text-right font-mono font-bold", (p.predictedSavings || 0) >= 0 ? "text-primary" : "text-destructive")}>
                      {p.predictedSavings?.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            {forecast.tips?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Lightbulb className="h-3 w-3" /> Dicas da IA
                </h4>
                <div className="space-y-2">
                  {forecast.tips.map((tip: string, i: number) => (
                    <div key={i} className="flex gap-2 text-sm text-foreground/70 bg-white/[0.02] p-3 rounded-xl border border-white/[0.03]">
                      <span className="text-primary shrink-0">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Alerts */}
            {forecast.riskAlerts?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" /> Alertas de Risco
                </h4>
                <div className="space-y-2">
                  {forecast.riskAlerts.map((alert: string, i: number) => (
                    <div key={i} className="flex gap-2 text-sm text-destructive/80 bg-destructive/5 p-3 rounded-xl border border-destructive/10">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{alert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
