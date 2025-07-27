
import { Phone, MapPin, Clock, Mail } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the form data to your backend
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            צור קשר
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            נשמח לעמוד לשירותכם ולענות על כל שאלה
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">פרטי התקשרות</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-red-600 p-3 rounded-full flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">טלפון:</div>
                    <div className="text-gray-400">972+ 0499301</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-red-600 p-3 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">כתובת:</div>
                    <div className="text-gray-400">גמלים ונט 9, חיפה</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-600 p-3 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">שעות פעילות:</div>
                    <div className="text-gray-400 space-y-1">
                      <div>ראשון - חמישי: 8:30 - 17:30</div>
                      <div>שישי: 8:30 - 13:00</div>
                      <div>שבת: סגור</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">מפת המסלול</h3>
              <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <MapPin className="w-12 h-12 text-red-500" />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">שלח הודעה</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">שם מלא</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="הכנס את שמך"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">אימייל</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="הכנס את כתובת האימייל שלך"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">טלפון</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="מספר טלפון"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">הודעה</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="כתוב את הודעתך כאן"
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                שלח הודעה
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
