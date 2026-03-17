export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; role: "admin" | "funcionario" | "cliente"; full_name: string | null; created_at: string };
        Insert: { id: string; role?: "admin" | "funcionario" | "cliente"; full_name?: string | null; created_at?: string };
        Update: { role?: "admin" | "funcionario" | "cliente"; full_name?: string | null };
      };
      funcionarios: {
        Row: { id: string; profile_id: string | null; nome: string; dias_trabalho: number[]; ativo: boolean; created_at: string };
        Insert: { id?: string; profile_id?: string | null; nome: string; dias_trabalho?: number[]; ativo?: boolean; created_at?: string };
        Update: { nome?: string; dias_trabalho?: number[]; ativo?: boolean };
      };
      servicos: {
        Row: { id: string; nome: string; duracao_min: number; preco: number; ativo: boolean; created_at: string };
        Insert: { id?: string; nome: string; duracao_min: number; preco: number; ativo?: boolean; created_at?: string };
        Update: { nome?: string; duracao_min?: number; preco?: number; ativo?: boolean };
      };
      funcionamento: {
        Row: { id: string; dia_semana: number; abre: string; fecha: string; ativo: boolean };
        Insert: { id?: string; dia_semana: number; abre: string; fecha: string; ativo?: boolean };
        Update: { abre?: string; fecha?: string; ativo?: boolean };
      };
      agendamentos: {
        Row: {
          id: string;
          cliente_id: string;
          funcionario_id: string;
          servico_id: string;
          inicio: string;
          fim: string;
          status: "agendado" | "cancelado" | "concluido";
          observacao: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          funcionario_id: string;
          servico_id: string;
          inicio: string;
          fim: string;
          status?: "agendado" | "cancelado" | "concluido";
          observacao?: string | null;
          created_at?: string;
        };
        Update: {
          status?: "agendado" | "cancelado" | "concluido";
          observacao?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
