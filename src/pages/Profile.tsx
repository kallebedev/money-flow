import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Mail, Camera } from "lucide-react";

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.user_metadata?.name || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("O nome não pode estar vazio");
            return;
        }

        setIsLoading(true);
        const { error } = await updateProfile({ name });
        setIsLoading(false);

        if (error) {
            toast.error("Erro ao atualizar perfil: " + error.message);
        } else {
            toast.success("Perfil atualizado com sucesso!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações de Perfil</h1>
                <p className="text-muted-foreground">Gerencie suas informações pessoais e como elas aparecem no FinanPro.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                <Card className="finance-card flex flex-col items-center justify-center p-6 space-y-4 h-fit">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                            <AvatarFallback className="text-2xl">{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed">
                            <Camera className="text-white h-6 w-6" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-lg">{user?.user_metadata?.name || "Usuário"}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </Card>

                <Card className="finance-card">
                    <CardHeader>
                        <CardTitle>Informações Básicas</CardTitle>
                        <CardDescription>Atualize seu nome e outras informações da conta.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10"
                                        placeholder="Seu nome"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 opacity-60">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="pl-10 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">O e-mail não pode ser alterado diretamente.</p>
                            </div>

                            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-destructive/20 bg-destructive/5 finance-card">
                <CardHeader>
                    <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                    <CardDescription>Ações irreversíveis relacionadas à sua conta.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="w-full md:w-auto opacity-50 cursor-not-allowed">
                        Excluir Minha Conta
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
