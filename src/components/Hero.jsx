const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <h1 className="text-2xl font-bold text-gray-900">
          <span className="blue_gradient">Smart Article</span> Analyzer
        </h1>
        <button
          type="button"
          onClick={() => window.open("https://github.com/Tabulater/Smart-Article-Analyzer-Pro")}
          className="black_btn"
        >
          GitHub
        </button>
      </nav>

      <h1 className="head_text">
        Smart Article <br className="max-md:hidden" />
        <span className="blue_gradient">Analyzer Pro</span>
      </h1>
      <h2 className="desc">
        Transform your reading experience with our AI-powered tool that analyzes and summarizes
        lengthy articles into clear, concise, and insightful summaries in seconds.
      </h2>
    </header>
  );
};

export default Hero;
