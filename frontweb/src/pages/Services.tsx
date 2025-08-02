import { ArrowLeft, Wrench, Gauge, CircleDot, Battery, Shield, Droplets, CheckCircle, Clock, Award } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link, useNavigate } from 'react-router-dom';


const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  
  const navigate = useNavigate();


  const services = [
    {
      icon: Wrench,
      title: "שירות כללי",
      shortDescription: "תחזוקה מקצועית לשמירה על ביצועי הרכב",
      description: "החלפת שמן, פילטר שמן ואוויר לשמירה על הביצועים של הרכב",
      image: '/img/p4.jpg',
      price: "מ-250 ₪",
      duration: "45-60 דקות",
      detailedInfo: {
        overview: "שירות תחזוקה מקצועי המיועד לשמור על הביצועים האופטימליים של הרכב שלכם",
        treatments: [
          "החלפת שמן מנוע איכותי",
          "החלפת פילטר שמן חדש",
          "החלפת פילטר אוויר",
          "בדיקת מפלס נוזלים",
          "בדיקה כללית של המנוע",
          "ניקוי וטיפוח חלקי המנוע"
        ],
        benefits: [
          "הארכת חיי המנוע",
          "שיפור יעילות הדלק",
          "הפחתת פליטות מזיקות",
          "מניעת בעיות יקרות בעתיד"
        ],
        warranty: "6 חודשים או 10,000 ק״מ"
      }
    },
    {
      icon: Gauge,
      title: "בדיקה כללית",
      shortDescription: "אבחון ממוחשב מקיף לכל מערכות הרכב",
      description: "בדיקה ממוחשבת לאיתור תקלות והבטחת הבטיחות",
      image: '/img/p9.jpg',
      price: "מ-150 ₪",
      duration: "30-45 דקות",
      detailedInfo: {
        overview: "בדיקה מקיפה וממוחשבת של כל מערכות הרכב להבטחת בטיחות ותקינות מלאה",
        treatments: [
          "סריקה ממוחשבת של המנוע",
          "בדיקת מערכת הבלמים",
          "בדיקת מערכת ההיגוי",
          "בדיקת מערכת החשמל",
          "בדיקת גלגלים וצמיגים",
          "בדיקת מערכת הפליטה"
        ],
        benefits: [
          "זיהוי מוקדם של בעיות",
          "הבטחת בטיחות הנהיגה",
          "חיסכון בעלויות תיקון",
          "עמידה בתקני הבטיחות"
        ],
        warranty: "דוח מפורט עם המלצות"
      }
    },
    {
      icon: CircleDot,
      title: "צמיגים",
      shortDescription: "החלפה, תיקון ואיזון מקצועי",
      description: "החלפה ותיקון צמיגים לכל הרכבים",
      image: '/img/p11.jpg',
      price: "מ-80 ₪",
      duration: "20-40 דקות",
      detailedInfo: {
        overview: "שירותי צמיגים מקצועיים לכל סוגי הרכבים עם ציוד מתקדם וצמיגי איכות",
        treatments: [
          "החלפת צמיגים חדשים",
          "תיקון נקבים וחורים",
          "איזון גלגלים דיגיטלי",
          "בדיקת לחץ אוויר",
          "סידור זוויות גלגלים",
          "ייעוץ לבחירת צמיגים מתאימים"
        ],
        benefits: [
          "נהיגה בטוחה ויציבה",
          "חיסכון בדלק",
          "הפחתת שחיקה",
          "שיפור הביצועים"
        ],
        warranty: "אחריות מלאה על התקנה"
      }
    },
    {
      icon: Battery,
      title: "מערכת חשמל",
      shortDescription: "תיקון ותחזוקת מערכות חשמל ומצבר",
      description: "תיקון ותחזוקה של מערכות החשמל והמצבר",
      image: '/img/p2.jpg',
      price: "מ-120 ₪",
      duration: "30-90 דקות",
      detailedInfo: {
        overview: "טיפול מקצועי במערכות החשמל של הרכב כולל מצבר, גנרטור ומערכות חשמל",
        treatments: [
          "בדיקת מצבר ומתח",
          "החלפת מצבר חדש",
          "תיקון גנרטור",
          "בדיקת מערכת טעינה",
          "תיקון תקלות חשמל",
          "בדיקת מערכות תאורה"
        ],
        benefits: [
          "הפעלה אמינה של הרכב",
          "מניעת תקלות פתאומיות",
          "חיסכון בעלויות החלפה",
          "שיפור ביצועי המערכות"
        ],
        warranty: "אחריות על חלקים ועבודה"
      }
    },
    {
      icon: Shield,
      title: "מערכת בלמים",
      shortDescription: "בדיקה ותיקון לבטיחות מרבית",
      description: "בדיקה ותיקון מערכת הבלמים לבטיחות מרבית",
      image: '/img/p10.jpg',
      price: "מ-200 ₪",
      duration: "60-120 דקות",
      detailedInfo: {
        overview: "שירות מערכת בלמים מקצועי להבטחת בטיחות מרבית בנהיגה",
        treatments: [
          "בדיקת רפידות בלם",
          "החלפת רפידות ודיסקים",
          "בדיקת נוזל בלמים",
          "תיקון מערכת בלמים",
          "בדיקת בלם יד",
          "כיול מערכת ABS"
        ],
        benefits: [
          "בטיחות מרבית בנהיגה",
          "מרחק בלימה קצר",
          "מניעת תאונות",
          "עמידה בתקני בטיחות"
        ],
        warranty: "אחריות מלאה על רכיבים"
      }
    },
    {
      icon: Droplets,
      title: "מערכת קירור",
      shortDescription: "תחזוקת רדיאטור ומערכת קירור",
      description: "תחזוקה ותיקון מערכת הקירור והרדיאטור",
      image: '/img/p3.jpg',
      price: "מ-180 ₪",
      duration: "45-90 דקות",
      detailedInfo: {
        overview: "טיפול מקצועי במערכת הקירור למניעת התחממות יתר ושמירה על המנוע",
        treatments: [
          "בדיקת רדיאטור ומאווררים",
          "החלפת נוזל קירור",
          "תיקון דליפות",
          "בדיקת משאבת מים",
          "ניקוי מערכת הקירור",
          "בדיקת תרמוסטט"
        ],
        benefits: [
          "מניעת התחממות יתר",
          "הגנה על המנוע",
          "שמירה על ביצועים",
          "הארכת חיי הרכיבים"
        ],
        warranty: "אחריות על עבודה וחלקים"
      }
    }
  ];

  const openServiceModal = (service) => {
    setSelectedService(service);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&h=1080&fit=crop&crop=center"
            alt="Professional garage services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors mb-6">
              <ArrowLeft className="w-5 h-5" />
              חזרה לעמוד הבית
            </Link>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            השירותים שלנו
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            מגוון רחב של שירותי תחזוקה ותיקון מקצועיים לרכב שלכם
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">6+</div>
              <div className="text-gray-300 text-sm">שירותים מקצועיים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">100%</div>
              <div className="text-gray-300 text-sm">שביעות רצון</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
              <div className="text-gray-300 text-sm">זמינות</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border-gray-700/50 hover:border-red-500/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-600/20 overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm p-3 rounded-full border border-red-500/30">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-600/30">
                    <span className="text-red-400 font-semibold text-sm">{service.price}</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>מקצועי</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => openServiceModal(service)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/25"
                  >
                    פרטים מלאים
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      <Dialog open={!!selectedService} onOpenChange={closeServiceModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
          {selectedService && (
            <>
              <DialogHeader className="text-right pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-xl shadow-lg">
                    <selectedService.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-3xl font-bold text-white mb-2">
                      {selectedService.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-300 text-lg">
                      {selectedService.detailedInfo.overview}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex justify-between items-end">
                      <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="text-red-400 font-bold text-lg">{selectedService.price}</div>
                      </div>
                      <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="text-white font-semibold">{selectedService.duration}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/60 border-gray-600/50 shadow-xl">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        טיפולים כלולים
                      </h4>
                      <ul className="space-y-3">
                        {selectedService.detailedInfo.treatments.map((treatment, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-200">
                            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="leading-relaxed">{treatment}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-600/30 shadow-xl">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        יתרונות השירות
                      </h4>
                      <ul className="space-y-3">
                        {selectedService.detailedInfo.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-200">
                            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="leading-relaxed">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="mt-8 bg-gradient-to-r from-purple-900/30 to-purple-800/20 border-purple-600/30">
                <CardContent className="p-6 text-center">
                  <h5 className="font-bold text-purple-400 mb-2 text-lg">אחריות</h5>
                  <p className="text-white text-lg">{selectedService.detailedInfo.warranty}</p>
                </CardContent>
              </Card>

              <div className="mt-8 text-center p-8 bg-gradient-to-r from-red-600/20 to-red-700/10 rounded-2xl border border-red-600/30">
                <h5 className="text-2xl font-bold text-white mb-3">מעוניינים בשירות זה?</h5>
                <p className="text-gray-300 mb-6 text-lg">צרו איתנו קשר לקביעת תור או לקבלת הצעת מחיר מותאמת אישית</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/contact')}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-3 text-lg"
                  >
                    קבע תור עכשיו
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesPage;
