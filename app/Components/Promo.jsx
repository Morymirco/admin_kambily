const Promo = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 my-4 sm:my-8">
      <div className="border-dotted rounded-2xl p-4 sm:p-6 bg-[#FFF5F5] relative overflow-hidden">
        {/* Arrière-plan avec effet */}
        <div className="absolute inset-0 opacity-10 text-[100px] sm:text-[200px] font-bold text-gray-400 flex items-center justify-center">
          100%
        </div>
        
        {/* Contenu */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10">
          {/* Pourcentage */}
          <span className="text-4xl sm:text-6xl font-bold text-gray-700 text-center sm:text-left">
            100%
          </span>

          {/* Texte principal */}
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-[#048B9A] mb-1">
              Livraison gratuite
              <span className="hidden sm:inline"> à 100% pour tout achats à partir de 350.000GNF !!!</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              <span className="sm:hidden">À partir de 350.000GNF</span>
              <span className="hidden sm:inline">Plus vous achetez, plus vous économisez!</span>
            </p>
          </div>

          {/* Badge Gratuit */}
          <span className="text-xl sm:text-2xl font-semibold text-gray-700 mt-2 sm:mt-0 sm:ml-auto">
            Gratuit
          </span>
        </div>
      </div>
    </div>
  );
};

export default Promo;
