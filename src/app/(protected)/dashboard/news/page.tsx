"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type News = {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error("Falha ao carregar notícias");
        }
        const data = await response.json();
        setNewsList(data.news);
      } catch (err) {
        setError("Erro ao carregar notícias");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) {
      return;
    }

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir notícia");
      }

      setNewsList(newsList.filter((news) => news.id !== id));
    } catch (error) {
      alert("Erro ao excluir notícia");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4">Carregando notícias...</p>
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
        <h2 className="text-2xl font-bold">Gerenciar Notícias</h2>
        <div className="flex gap-2">
          <Link
            href="/dashboard/news/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Nova Notícia
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>

      {newsList.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma notícia encontrada
          </p>
          <Link
            href="/dashboard/news/create"
            className="mt-4 inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition"
          >
            Criar primeira notícia
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {news.date}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/news/edit/${news.id}`}
                    className="text-yellow-600 hover:text-yellow-700 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md text-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(news.id)}
                    className="text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
              
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {news.summary}
              </p>
              
              {news.image && (
                <div className="mt-4">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-40 object-cover rounded-md"
                  />
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>Criada em: {new Date(news.createdAt).toLocaleString()}</p>
                <p>Atualizada em: {new Date(news.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 