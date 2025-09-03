import { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

// History item component for better code organization
const HistoryItem = ({ article, active, onCopy, copied }) => (
  <div className="link_card">
    <div className="copy_btn" onClick={() => onCopy(article.url)}>
      <img
        src={copied === article.url ? tick : copy}
        alt="copy_icon"
        className="w-[40%] h-[40%] object-contain"
      />
    </div>
    <p
      className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate"
      onClick={() => window.open(article.url, "_blank")}
    >
      {article.url}
    </p>
  </div>
);

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) setAllArticles(articlesFromLocalStorage);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="mt-10 w-full max-w-4xl bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
      {/* Search */}
      <div className="flex flex-col w-full gap-4">
        <h2 className="text-2xl font-satoshi font-bold text-gray-900">
          Analyze any article
          <span className="blue_gradient"> in seconds</span>
        </h2>
        <form
          className="relative flex justify-center items-center bg-white rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↵
          </button>
        </form>

        {/* Browse URL History */}
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Recent Analyses</h3>
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className={`link_card transition-all duration-200 hover:shadow-md ${
                article.url === item.url ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <HistoryItem
                article={item}
                active={article.url === item.url}
                onCopy={handleCopy}
                copied={copied}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Display Results */}
      <div className="my-8 max-w-full">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white/50 rounded-xl">
            <img src={loader} alt="Analyzing..." className="w-16 h-16 object-contain mb-4" />
            <p className="text-gray-600 font-medium">Analyzing article content...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Oops! Something went wrong
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error?.data?.error || 'Failed to analyze the article. Please try again.'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : article.summary ? (
          <div className="bg-white/90 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Analysis <span className="blue_gradient">Results</span>
              </h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(article.summary);
                  setCopied('summary');
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {copied === 'summary' ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="leading-relaxed">{article.summary}</p>
            </div>
            {article.url && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View original article
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Demo;
