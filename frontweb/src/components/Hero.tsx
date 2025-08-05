
import { ArrowLeft, Phone } from 'lucide-react';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* High-quality automotive background */}
      <div className="absolute inset-0">
        <img
          src="https://cdn.prod.website-files.com/678cca1dba65076a9fd94f2d/678fd14e0f4bbe06039930ea_646be3adce622fc3c2d0b54a_62a3614cf23bdd729af9ff43_Tekmetric-Auto-Repair-Shop%2525201-min.webp"
          alt="Professional garage background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-red-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-red-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border border-red-500/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced main heading with better typography */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 leading-tight tracking-tight">
              <span className="block mb-2 text-shadow-lg">ברוכים הבאים</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 drop-shadow-sm">למוסך</span>
              <span className="block mt-2 text-shadow-lg">המתקדם</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>

          {/* Enhanced subtitle */}
          <p className="text-2xl md:text-3xl text-gray-200 mb-6 leading-relaxed font-light">
            השירות המהימן והמקצועי שלכם
          </p>

          {/* Enhanced description */}
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            עם שנות ניסיון רבות ובציוד המתקדם ביותר, אנחנו מספקים שירות מקצועי ואמין 
            לכל סוגי הרכbים. הצוות המנוסה שלנו כאן כדי לדאוג שהרכב שלכם יהיה תמיד במצב מושלם.
          </p>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={scrollToContact}
              className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/30 flex items-center gap-3 border border-red-500/20"
            >
              <Phone className="w-6 h-6" />
              קבע תור עכשיו
              <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative border-2 border-white/30 hover:border-red-500/70 text-white hover:text-red-400 px-10 py-5 rounded-full text-xl font-bold transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/5 hover:bg-white/10"
            >
              <span className="relative z-10">הצג שירותים</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:to-red-600/5 transition-all duration-300"></div>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">15+</div>
              <div className="text-gray-300 text-sm font-medium">שנות ניסיון</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">1000+</div>
              <div className="text-gray-300 text-sm font-medium">לקוחות מרוצים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
              <div className="text-gray-300 text-sm font-medium">שירות חירום</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
