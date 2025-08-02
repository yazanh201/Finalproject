import { Wrench, Gauge, CircleDot, Battery, Shield, Droplets, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: Wrench,
      title: "שירות כללי",
      description: "החלפת שמן, פילטר שמן ואוויר לשמירה על הביצועים של הרכב",
      image: '/img/p44.jpeg',

    },
    {
      icon: Gauge,
      title: "בדיקה כללית",
      description: "בדיקה ממוחשבת לאיתור תקלות והבטחת הבטיחות",
      image: '/img/p9.jpg',
    },
    {
      icon: CircleDot,
      title: "צמיגים",
      description: "החלפה ותיקון צמיגים לכל הרכבים",
      image: '/img/p11.jpg',
    },
    {
      icon: Battery,
      title: "מערכת חשמל",
      description: "תיקון ותחזוקה של מערכות החשמל והמצבר",
      image: '/img/p2.jpg',
    },
    {
      icon: Shield,
      title: "מערכת בלמים",
      description: "בדיקה ותיקון מערכת הבלמים לבטיחות מרבית",
      image: '/img/p10.jpg',
    },
    {
      icon: Droplets,
      title: "מערכת קירור",
      description: "תחזוקה ותיקון מערכת הקירור והרדיאטור",
      image: '/img/p3.jpg',
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            השירותים שלנו
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            אנו מספקים מגוון רחב של שירותי תחזוקה ותיקון לרכב שלכם
          </p>
          <Link to="/services">
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-3 text-lg rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              צפה בכל השירותים
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group bg-black/40 backdrop-blur-sm border-gray-800 hover:border-red-600/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-600/10 overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-red-600 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <Link to="/services">
                    <Button
                      className="text-red-500 hover:text-red-400 hover:bg-red-600/10 font-semibold p-0 h-auto flex items-center gap-2"
                    >
                      למידע מפורט
                      <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
