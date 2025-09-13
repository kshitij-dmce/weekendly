// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./LandingPage.css"; // create for custom styles

// function LandingPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="landing-bg">
//       <div className="landing-container">
//         <header>
//           <h1 className="brand-title">
//             <span role="img" aria-label="sparkle">✨</span> Weekendly <span role="img" aria-label="calendar">📅</span>
//           </h1>
//           <p className="brand-tagline">
//             Your playful, visual planner for memorable weekends.
//           </p>
//         </header>
//         <section className="about-section">
//           <h2>About</h2>
//           <p>
//             Weekendly helps you craft the perfect weekend or long weekend.
//             Select a vibe, build a schedule, drag and drop activities, and even get surprise plans!
//           </p>
//         </section>
//         <section className="cta-section">
//           <button className="cta-btn" onClick={() => navigate("/weekend")}>
//             🎈 Start a New Weekend Plan
//           </button>
//           <button className="cta-btn" onClick={() => navigate("/long-weekend")}>
//             🌟 Plan a Long Weekend
//           </button>
//         </section>
//         <section className="features-section">
//           <h3>Features</h3>
//           <ul>
//             <li>🎡 Mood-based suggestions</li>
//             <li>✨ Drag & drop scheduling</li>
//             <li>🔒 Lock & randomize slots</li>
//             <li>🎨 Beautiful themes</li>
//             <li>📤 Export & share your plan</li>
//           </ul>
//         </section>
//         <footer>
//           <span>Made with <span role="img" aria-label="love">💛</span> for your weekends</span>
//         </footer>
//       </div>
//     </div>
//   );
// }

// export default LandingPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css" // Import the external CSS file

function LandingPage() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [highlightedFeature, setHighlightedFeature] = useState(0);

  // Features animation
  useEffect(() => {
    setAnimate(true);
    const timer = setInterval(() => {
      setHighlightedFeature(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Features data with emojis and descriptions
  const features = [
    { emoji: "🎡", title: "Mood-based suggestions", desc: "Activities that match your vibe" },
    { emoji: "✨", title: "Drag & drop scheduling", desc: "Plan your days with ease" },
    { emoji: "🔒", title: "Lock & randomize slots", desc: "Keep favorites, shuffle the rest" },
    { emoji: "🎨", title: "Beautiful themes", desc: "Customize the look and feel" },
    { emoji: "📤", title: "Export & share", desc: "Show off your weekend plans" }
  ];

  return (
    <div className="landing-bg">
      {/* Background elements */}
      <div className="bg-bubble bg-bubble-1"></div>
      <div className="bg-bubble bg-bubble-2"></div>
      <div className="bg-bubble bg-bubble-3"></div>

      <div className="container max-w-6xl mx-auto px-4 py-12 relative z-10">
        <header className={`text-center mb-16 transition-opacity duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <span className="text-5xl animate-float-slow">✨</span>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
              Weekendly
            </h1>
            <span className="text-5xl animate-float">📅</span>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Your playful, visual planner for memorable weekends
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-16">
          <div className={`transition-all duration-700 delay-300 ${animate ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Craft your perfect weekend</h2>
            <p className="text-lg text-gray-600 mb-8">
              Whether you're feeling adventurous, lazy, or somewhere in between, 
              Weekendly helps you design weekends that match your mood and energy level.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 btn-container">
              <button 
                onClick={() => navigate("/weekend")}
                className="btn-primary"
              >
                <span className="mr-2 text-xl">🎈</span> Create Weekend Plan
              </button>
              <button 
                onClick={() => navigate("/long-weekend")}
                className="btn-secondary"
              >
                <span className="mr-2 text-xl">🌟</span> Plan Long Weekend
              </button>
            </div>
          </div>

          <div className={`bg-white p-6 rounded-2xl shadow-xl transition-all duration-700 delay-500 ${animate ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="preview-window">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="preview-title">Weekend Preview</div>
              </div>
              <div className="preview-body">
                <div className="flex flex-col space-y-3">
                  <div className="preview-day">
                    <div className="preview-day-header">Saturday</div>
                    <div className="preview-slots">
                      <div className="preview-slot">🥞 Brunch</div>
                      <div className="preview-slot">🚴‍♀️ Bike Ride</div>
                      <div className="preview-slot">🎬 Movie Night</div>
                    </div>
                  </div>
                  <div className="preview-day">
                    <div className="preview-day-header">Sunday</div>
                    <div className="preview-slots">
                      <div className="preview-slot">📚 Reading</div>
                      <div className="preview-slot">🧘‍♂️ Yoga</div>
                      <div className="preview-slot">🍝 Cooking</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className={`mb-16 transition-all duration-700 delay-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 feature-grid">
            {features.map((feature, i) => (
              <div 
                key={i}
                className={`feature-card ${i === highlightedFeature ? 'feature-highlighted' : ''}`}
              >
                <div className="text-4xl mb-3">{feature.emoji}</div>
                <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`text-center max-w-3xl mx-auto transition-opacity duration-700 delay-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to make your weekend amazing?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of people who use Weekendly to make the most of their free time.
          </p>
          <button 
            onClick={() => navigate("/weekend")}
            className="btn-primary mx-auto"
          >
            Get Started Now
          </button>
        </section>

        <footer className="mt-24 text-center text-gray-500">
          <p>Made with <span className="text-red-500">❤️</span> for your weekends</p>
          <p className="text-sm mt-2">© {new Date().getFullYear()} Weekendly</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;