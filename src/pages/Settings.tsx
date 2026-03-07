import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, CreditCard, Shield, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
    const { user, updateUserMetadata } = useAuth();
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in px-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#f0f0f0]">Configurações</h1>
                <p className="text-muted-foreground">Personalize sua experiência no MoneyFlow.</p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-[#111]/50 border-white/[0.06] overflow-hidden">
                    <CardHeader className="border-b border-white/[0.03]">
                        <CardTitle className="text-lg">Score Financeiro Personalizado</CardTitle>
                        <CardDescription>Ajuste os parâmetros que definem sua saúde financeira.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-[#555]">Taxa de Poupança Ideal (%)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        value={(user?.user_metadata?.idealSavingsRate || 0.2) * 100}
                                        onChange={(e) => updateUserMetadata({ idealSavingsRate: Number(e.target.value) / 100 })}
                                        className="bg-[#161616] border-white/[0.06] h-10"
                                    />
                                    <Badge variant="outline" className="h-10 px-3 bg-blue-500/10 text-blue-500 border-none">Poupar</Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Padrão: 20% da renda mensal.</p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-[#555]">Reserva de Emergência (Meses)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        value={user?.user_metadata?.emergencyFundMonths || 6}
                                        onChange={(e) => updateUserMetadata({ emergencyFundMonths: Number(e.target.value) })}
                                        className="bg-[#161616] border-white/[0.06] h-10"
                                    />
                                    <Badge variant="outline" className="h-10 px-3 bg-emerald-500/10 text-emerald-500 border-none">Segurança</Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Padrão: 6 meses de gastos fixos.</p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-[#555]">Limite de Cartão/Renda (%)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        value={(user?.user_metadata?.maxDebtRatio || 0.3) * 100}
                                        onChange={(e) => updateUserMetadata({ maxDebtRatio: Number(e.target.value) / 100 })}
                                        className="bg-[#161616] border-white/[0.06] h-10"
                                    />
                                    <Badge variant="outline" className="h-10 px-3 bg-red-500/10 text-red-500 border-none">Dívida</Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Padrão: Máximo 30% da renda.</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/[0.03]">
                            <p className="text-[11px] text-muted-foreground italic">
                                * Essas configurações afetam diretamente o seu Health Score no Dashboard e os conselhos da IA.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#111]/50 border-white/[0.06] overflow-hidden">
                    <CardHeader className="border-b border-white/[0.03]">
                        <CardTitle className="text-lg">Aparência</CardTitle>
                        <CardDescription>Escolha como o sistema deve aparecer para você.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-[#f0f0f0]">Tema do Sistema</Label>
                            <p className="text-xs text-[#555]">Alternar entre modo claro e escuro.</p>
                        </div>
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#161616] border border-white/[0.06]">
                            <ThemeToggle />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-[#111]/50 border-white/[0.06] opacity-60">
                        <CardHeader>
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <Bell className="w-5 h-5 text-blue-500" />
                            </div>
                            <CardTitle className="text-base text-[#f0f0f0]">Notificações</CardTitle>
                            <CardDescription>Gerencie seus alertas financeiros (Em breve).</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="bg-[#111]/50 border-white/[0.06] opacity-60">
                        <CardHeader>
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                                <Globe className="w-5 h-5 text-emerald-500" />
                            </div>
                            <CardTitle className="text-base text-[#f0f0f0]">Idioma e Região</CardTitle>
                            <CardDescription>Altere o formato de data e moeda (Em breve).</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="bg-[#111]/50 border-white/[0.06] opacity-60">
                        <CardHeader>
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                                <Shield className="w-5 h-5 text-purple-500" />
                            </div>
                            <CardTitle className="text-base text-[#f0f0f0]">Privacidade</CardTitle>
                            <CardDescription>Configurações de segurança da conta (Em breve).</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="bg-[#111]/50 border-white/[0.06] opacity-60">
                        <CardHeader>
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                                <CreditCard className="w-5 h-5 text-orange-500" />
                            </div>
                            <CardTitle className="text-base text-[#f0f0f0]">Assinatura</CardTitle>
                            <CardDescription>Gerencie seu plano Premium (Em breve).</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
}
