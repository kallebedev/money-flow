import { useState, useEffect } from "react";
import { useFinance } from "../contexts/FinanceContext";
import { generateBudgetAdvice, AIBudgetAdvice } from "../lib/openai";

export interface BudgetProfileData {
    goal: "debt" | "savings" | "moderate";
    lifestyle: "frugal" | "comfortable" | "custom";
    priority: "essentials" | "future" | "lifestyle";
}

export function useAIBudgetAdvisor(profileData?: BudgetProfileData, trigger: boolean = false) {
    const { monthlySalary, categories } = useFinance();
    const [advisor, setAdvisor] = useState<AIBudgetAdvice | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!trigger || !monthlySalary || monthlySalary <= 0 || !profileData) {
            return;
        }

        const fetchAdvice = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await generateBudgetAdvice(monthlySalary, profileData, categories);
                setAdvisor(data);
            } catch (err: any) {
                console.error("AI Budget Error:", err);
                setError(err.message || "Erro ao gerar conselho de IA");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdvice();
    }, [monthlySalary, profileData, trigger]);

    return { advisor, isLoading, error };
}
