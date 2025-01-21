'use client'
import React, { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import Image from 'next/image';
import Head from 'next/head';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API;

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  }
}

const fetchNews = async (page: number) => {
  if (!NEWS_API_KEY) {
    throw new Error('News API key is not configured');
  }
  
  try {
    const response = await fetch(
        `https://newsapi.org/v2/everything?q=medical OR health&apiKey=${NEWS_API_KEY}&pageSize=10&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    const validArticles = data.articles.filter((article: NewsArticle) => {
        return article.title && article.description && article.url && article.urlToImage;
      });
    return validArticles;
    }
    catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

const Page = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchAndSetNews = async () => {
    try {
      const articles = await fetchNews(page);
      setNews((prevNews) => [...prevNews, ...articles]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetNews();
  }, [page]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner className="w-8 h-8" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Beta Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 mb-8 mt-16">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-white text-xs px-2 py-1 rounded-full">BETA</span>
          <p className="text-amber-700">
            This feature is currently in beta. Some functionality may be limited or change without notice.
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">
        Healthcare News
        <span className="ml-2 text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Beta</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-slate-200">
            {article.urlToImage && (
              <Image
                src={article.urlToImage}
                alt={article.title}
                width={500}
                height={300}
                objectFit="cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2 text-slate-900">{article.title}</h2>
              <p className="text-slate-600 mb-4 line-clamp-3">{article.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">{article.source.name}</span>
                  <span className="text-xs text-slate-400">
                    {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  Read more → 
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button 
          onClick={() => setPage(prev => prev + 1)} 
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
        >
          Load More
        </button>
      </div>

      {/* Modified error state for beta */}
      {error && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-amber-700 text-center p-4 bg-amber-50 rounded-lg max-w-md">
            <p className="mb-2">{error}</p>
            <p className="text-sm">As this feature is in beta, you might experience occasional issues.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
