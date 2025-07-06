import React, { useState } from 'react';
import { ActionButtons } from '@/components/ActionButtons';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { useExpenses } from '@/hooks/useExpenses';
import { useToast } from '@/hooks/use-toast';
import { Expense } from '@/types/expense';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { toast } = useToast();

  const handleManualEntry = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      await updateExpense({ ...data, id: editingExpense.id });
    } else {
      await addExpense(data);
    }
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleAudioCapture = () => {
    if (isListening) return;
    
    setIsListening(true);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      toast({
        title: "Áudio capturado",
        description: `Texto: "${transcript}". Funcionalidade de processamento será implementada.`
      });
      
      setIsListening(false);
    };

    recognition.onerror = () => {
      toast({
        title: "Erro no áudio",
        description: "Não foi possível capturar o áudio.",
        variant: "destructive"
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    
    toast({
      title: "Gravando...",
      description: "Fale agora para capturar sua despesa."
    });
  };

  const handleFileUpload = (file: File) => {
    toast({
      title: "Arquivo recebido",
      description: `Arquivo "${file.name}" foi carregado. Funcionalidade de processamento será implementada.`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 max-w-4xl mx-auto">
      <div className="space-y-6">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Despesa Inteligente
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas finanças de forma inteligente
          </p>
        </header>

        {showForm ? (
          <ExpenseForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
            initialData={editingExpense || undefined}
          />
        ) : (
          <>
            <ActionButtons
              onManualEntry={handleManualEntry}
              onAudioCapture={handleAudioCapture}
              onFileUpload={handleFileUpload}
            />

            <ExpenseList
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={deleteExpense}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
