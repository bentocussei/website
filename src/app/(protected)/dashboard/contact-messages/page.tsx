"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  timestamp: string;
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch("/api/contact");
        if (!response.ok) {
          throw new Error("Falha ao carregar mensagens");
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError("Erro ao carregar mensagens de contato");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4">Carregando mensagens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mensagens de Contato</h2>
        <Link
          href="/dashboard"
          className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Voltar ao Dashboard
        </Link>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma mensagem de contato encontrada
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{message.name}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {message.email}
              </p>
              {message.subject && (
                <p className="mt-2 font-medium">Assunto: {message.subject}</p>
              )}
              <p className="mt-2 whitespace-pre-line">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 