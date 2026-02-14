import { Link } from "react-router";
import { ArrowRight, CheckCircle, Clock, TrendingUp, Target, Calendar, MessageSquare, Zap, Lock } from "lucide-react";
import React, { useEffect, useRef } from "react";
import logoImage from '../assets/ffa6cb3f0d02afe82155542d62a0d3bbbbcaa910.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logoImage} alt="Vendoura Hub" className="h-7 sm:h-8" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              to="/login" 
              className="text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-2 sm:px-0"
            >
              Sign In
            </Link>
            <Link 
              to="/apply" 
              className="px-3 sm:px-6 py-2 sm:py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              <span className="hidden sm:inline">Start Your 12-Week Build</span>
              <span className="sm:hidden">Apply Now</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-900 text-white rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              For Creative Founders Who Need Structure
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight">
              Turn Creative Energy<br/>Into Revenue Growth
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 mb-6 sm:mb-10 leading-relaxed px-4 sm:px-0">
              Build the business you know you're capable of—in 12 focused weeks.<br className="hidden sm:inline"/>
              A simple system that turns your talent into commercial momentum.
            </p>
            <Link 
              to="/apply" 
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium text-sm sm:text-base lg:text-lg shadow-lg"
            >
              <span className="hidden sm:inline">Apply to Join the Next Cohort</span>
              <span className="sm:hidden">Apply Now</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
          
          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto px-4 sm:px-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-100 border-b border-neutral-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-xs sm:text-sm text-neutral-500 truncate">vendoura.com/dashboard</div>
              </div>
              
              <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Welcome back, Sarah</h2>
                    <p className="text-sm sm:text-base text-neutral-600">Design Studio · B2B SaaS</p>
                  </div>
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 border border-green-200 rounded-lg self-start sm:self-auto">
                    <div className="text-xs sm:text-sm font-medium text-green-700">Week 8 · Momentum Building</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="text-xs sm:text-sm text-blue-700 mb-1">Current Revenue (30d)</div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-900">₦2.4M</div>
                    <div className="text-xs sm:text-sm text-green-600 font-medium mt-1">+₦900K (60%)</div>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                    <div className="text-xs sm:text-sm text-purple-700 mb-1">Best Revenue/Hour</div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-900">₦145K</div>
                    <div className="text-xs sm:text-sm text-purple-600 mt-1">Partnership outreach</div>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="text-xs sm:text-sm text-green-700 mb-1">Weeks with Growth</div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-900">7/8</div>
                    <div className="text-xs sm:text-sm text-green-600 mt-1">Consistent execution</div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6 bg-amber-50 border-2 border-amber-300 rounded-lg">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-amber-900 mb-1">This Week's Focus</div>
                      <div className="text-sm text-amber-800 mb-3">Launch discount campaign to existing customers · 15 hours committed</div>
                      <div className="text-xs text-amber-700 font-medium">Report due Friday 6pm · On track</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* You Already Have Everything */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">You Already Have What It Takes</h2>
          <div className="space-y-4 text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed">
            <p>You already have the creativity. You already have the product. You already have the vision.</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-neutral-200">
              Now imagine pairing that with structure.
            </p>
          </div>
        </div>
      </section>

      {/* Where Creative Meets Structure */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Where Creative Energy Meets Revenue Discipline</h2>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Creative founders don't struggle with ideas. They struggle with consistency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-100 text-neutral-700 rounded-full text-xs sm:text-sm font-medium mb-4">
                The Pattern You Know Too Well
              </div>
              <div className="space-y-3 sm:space-y-4 text-neutral-700 text-base sm:text-lg">
                <p>One week you're inspired. The next week you're buried in "important" tasks.</p>
                <p>Revenue feels unpredictable—even when the product is strong.</p>
                <p className="text-neutral-500 italic pt-4">Sound familiar?</p>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium mb-4">
                What Changes With Structure
              </div>
              <div className="space-y-3 sm:space-y-4">
                <TransformItem text="Every week, your focus narrows to one clear revenue action" />
                <TransformItem text="Every action ties directly to income" />
                <TransformItem text="Every result is measured" />
                <div className="pt-4 pl-6 sm:pl-8 border-l-4 border-green-500">
                  <p className="font-bold text-base sm:text-lg">You stop guessing. You start scaling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* The 5-Step Loop */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">The 5-Step Weekly Revenue Loop</h2>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600">
              A simple rhythm. Repeated for 12 weeks. Small wins compound into serious growth.
            </p>
          </div>
          
          <div className="grid gap-4 sm:gap-6">
            <StepCard 
              number="1"
              title="Commit"
              time="Monday Morning"
              description="Choose one specific revenue move for the week. A clear action that can generate money."
              example="Call 25 warm leads with end-of-quarter discount offer"
              color="blue"
            />
            <StepCard 
              number="2"
              title="Execute"
              time="Monday–Friday"
              description="Dedicate focused hours to that one move. Track your time. Capture proof. Build momentum."
              example="15 hours logged · 18 calls completed · 4 follow-up emails sent"
              color="green"
            />
            <StepCard 
              number="3"
              title="Report"
              time="Friday Evening"
              description="Submit your results. Revenue generated. Deals closed. Clients secured."
              example="₦580K generated · 3 contracts signed · Screenshots uploaded"
              color="amber"
            />
            <StepCard 
              number="4"
              title="Diagnose"
              time="Weekend Insight"
              description="The system shows you what your time was worth. Data replaces guesswork."
              example="₦38,667 per hour · Top 20% performer this week"
              color="purple"
            />
            <StepCard 
              number="5"
              title="Adjust"
              time="Sunday Reset"
              description="Refine. Double down. Design the next week with clarity."
              example="Next week: Expand to 35 leads with refined pitch"
              color="red"
            />
          </div>
        </div>
      </section>

      {/* Locked Testimonials Section */}
      <TestimonialsSection />

      {/* Everything Built In */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">Everything You Need Is Built In</h2>
          <p className="text-center text-neutral-600 mb-12 sm:mb-16 text-base sm:text-lg px-4 sm:px-0">
            This isn't about working endlessly. It's about working precisely.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard 
              icon={<Target className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Clear Weekly Targets"
              description="One focused revenue move at a time. No overwhelm, just clarity."
            />
            <FeatureCard 
              icon={<Clock className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Monday–Friday Execution"
              description="Sustainable intensity. Work the week, rest the weekend."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Live Revenue Tracking"
              description="Watch progress build. See your growth in real-time."
            />
            <FeatureCard 
              icon={<MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Community Insight"
              description="See what's working for other founders. Share proven tactics."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Evidence-Based Accountability"
              description="Your results speak for themselves. No fluff, just facts."
            />
            <FeatureCard 
              icon={<Calendar className="w-6 h-6 sm:w-8 sm:h-8" />}
              title="Structured Deadlines"
              description="Momentum never stalls. The system keeps you moving forward."
            />
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Picture Your Business 90 Days From Now</h2>
          
          <div className="p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200 max-w-2xl mx-auto">
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 mb-3 sm:mb-4">Instead of asking,</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-400 mb-6 sm:mb-8">"Why isn't this growing?"</p>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 mb-3 sm:mb-4">You're asking,</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">"How do I scale this further?"</p>
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-neutral-600 mt-8 sm:mt-12">
            That shift is what this accelerator creates.
          </p>
        </div>
      </section>
      
      {/* Final CTA - Welcoming */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">If You're Building Something Real, You Belong Here</h2>
          
          <div className="text-sm sm:text-base lg:text-lg text-neutral-300 mb-8 sm:mb-12 space-y-3 sm:space-y-4 leading-relaxed">
            <p>Whether you're earning ₦50K or ₦2M per month, whether you're early-stage or rebuilding momentum—</p>
            
            <p className="text-base sm:text-lg lg:text-xl font-medium text-white pt-4">
              If you're ready to focus your creativity into measurable growth, this is your environment.
            </p>

            <div className="pt-6 sm:pt-8 space-y-2 sm:space-y-3">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">You bring the vision. Vendoura brings the structure.</p>
              <p className="text-base sm:text-lg lg:text-xl text-neutral-300 pt-4">Together, we turn effort into revenue.</p>
            </div>
          </div>

          <Link 
            to="/apply" 
            className="inline-flex items-center gap-2 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors font-bold text-base sm:text-lg lg:text-xl shadow-2xl"
          >
            Start Your 12-Week Build
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          
          <div className="mt-6 sm:mt-8 text-neutral-400">
            <p className="text-sm sm:text-base lg:text-lg font-medium text-white">Your next quarter can look completely different.</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-neutral-200 py-6 sm:py-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-neutral-600">
          © 2026 Vendoura. Where creative talent becomes commercial momentum.
        </div>
      </footer>
    </div>
  );
}

// Auto-scrolling testimonials with blur and lock
function TestimonialsSection() {
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftCol = leftColumnRef.current;
    const rightCol = rightColumnRef.current;
    
    if (!leftCol || !rightCol) return;

    let leftScroll = 0;
    let rightScroll = 0;

    const scrollSpeed = 0.5;

    const animate = () => {
      // Scroll left column down
      leftScroll += scrollSpeed;
      if (leftScroll >= leftCol.scrollHeight / 2) {
        leftScroll = 0;
      }
      leftCol.style.transform = `translateY(-${leftScroll}px)`;

      // Scroll right column up
      rightScroll += scrollSpeed;
      if (rightScroll >= rightCol.scrollHeight / 2) {
        rightScroll = 0;
      }
      rightCol.style.transform = `translateY(-${rightScroll}px)`;

      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const leftTestimonials = [
    {
      name: "Chioma Okafor",
      business: "Fashion Brand · Lagos",
      text: "Week 4 and I've already doubled my monthly revenue. The clarity is unreal. I finally know what actually works.",
      revenue: "₦450K → ₦920K"
    },
    {
      name: "David Adebayo",
      business: "Digital Agency · Abuja",
      text: "The evidence requirement changed everything. No more wasting time on 'marketing' that doesn't convert. Just focused sales actions.",
      revenue: "₦1.2M → ₦2.8M"
    },
    {
      name: "Ngozi Chukwu",
      business: "B2B SaaS · Remote",
      text: "I was always creative but terrible at follow-through. The Monday-Friday structure forced me to actually execute. 8 weeks in, I have a real system.",
      revenue: "₦180K → ₦650K"
    },
    {
      name: "Ibrahim Musa",
      business: "Consulting · Port Harcourt",
      text: "The ₦/hour metric is addictive. I now optimize every revenue action. My time is worth ₦85K/hour now. Started at ₦12K.",
      revenue: "3x revenue growth"
    },
    {
      name: "Funmi Adeleke",
      business: "Creative Studio · Lagos",
      text: "Finally, a program that understands creative founders. Structure without rigidity. Accountability without judgment. This works.",
      revenue: "₦320K → ₦1.1M"
    },
    {
      name: "Emeka Obi",
      business: "E-commerce · Enugu",
      text: "The community alone is worth it. Seeing other founders' tactics in real-time helped me 10x my outreach effectiveness.",
      revenue: "₦780K → ₦2.4M"
    },
  ];

  const rightTestimonials = [
    {
      name: "Aisha Mohammed",
      business: "Education Tech · Kano",
      text: "Week 10 now. I can predict my revenue. That's power I never had before. The data-driven approach is revolutionary.",
      revenue: "₦290K → ₦890K"
    },
    {
      name: "Tunde Williams",
      business: "Marketing Agency · Ibadan",
      text: "The Friday reports are my favorite part. Ending the week with evidence of progress is incredibly motivating. I'm consistent now.",
      revenue: "₦1.5M → ₦3.2M"
    },
    {
      name: "Blessing Okoro",
      business: "Health & Wellness · Lagos",
      text: "I tried 3 other programs. They all focused on mindset. Vendoura focuses on revenue. That's the difference. Real results.",
      revenue: "₦95K → ₦410K"
    },
    {
      name: "Chidi Nwankwo",
      business: "Tech Consulting · Lagos",
      text: "The productive discomfort is real. You can't hide from yourself. But that's exactly what I needed. Massive growth in 12 weeks.",
      revenue: "₦2.1M → ₦5.8M"
    },
    {
      name: "Yetunde Bakare",
      business: "Content Agency · Remote",
      text: "From scattered efforts to laser focus. The weekly commit forces me to choose what matters. My conversion rate tripled.",
      revenue: "₦420K → ₦1.6M"
    },
    {
      name: "Olumide Hassan",
      business: "Product Design · Lagos",
      text: "The stage unlocking system kept me motivated. Each milestone felt earned. By week 12, I had built a revenue machine.",
      revenue: "₦560K → ₦2.2M"
    },
  ];

  // Duplicate testimonials for seamless loop
  const leftTestimonialsLoop = [...leftTestimonials, ...leftTestimonials];
  const rightTestimonialsLoop = [...rightTestimonials, ...rightTestimonials];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-neutral-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Founders Are Winning Inside</h2>
          <p className="text-base sm:text-lg text-neutral-600">Real results from the current cohort</p>
        </div>

        {/* Two-column scrolling testimonials */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 overflow-hidden" style={{ height: '600px' }}>
            {/* Left column - scrolls down */}
            <div ref={leftColumnRef} className="space-y-4 sm:space-y-6">
              {leftTestimonialsLoop.map((testimonial, index) => (
                <TestimonialCard key={`left-${index}`} {...testimonial} />
              ))}
            </div>

            {/* Right column - scrolls up - hidden on mobile */}
            <div ref={rightColumnRef} className="hidden md:block space-y-4 sm:space-y-6">
              {rightTestimonialsLoop.map((testimonial, index) => (
                <TestimonialCard key={`right-${index}`} {...testimonial} />
              ))}
            </div>
          </div>

          {/* Blur overlay with lock icon */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none" />
          <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl border-2 border-neutral-300 p-6 sm:p-8 shadow-2xl text-center max-w-md w-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Join to See Full Stories</h3>
              <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6">
                Get access to detailed breakdowns, tactics, and revenue strategies from founders currently in the program.
              </p>
              <Link 
                to="/apply" 
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-bold text-sm sm:text-base shadow-lg"
              >
                Start Your Application
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, business, text, revenue }: {
  name: string;
  business: string;
  text: string;
  revenue: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="mb-4">
        <div className="font-bold text-lg">{name}</div>
        <div className="text-sm text-neutral-500">{business}</div>
      </div>
      <p className="text-neutral-700 mb-4 leading-relaxed">{text}</p>
      <div className="pt-4 border-t border-neutral-200">
        <div className="text-sm font-bold text-green-700">{revenue}</div>
      </div>
    </div>
  );
}

function TransformItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
      <span className="text-neutral-700 text-lg">{text}</span>
    </div>
  );
}

function StepCard({ number, title, time, description, example, color }: { 
  number: string;
  title: string;
  time: string;
  description: string;
  example: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "from-blue-50 to-indigo-50 border-blue-200",
    green: "from-green-50 to-emerald-50 border-green-200",
    amber: "from-amber-50 to-orange-50 border-amber-200",
    purple: "from-purple-50 to-pink-50 border-purple-200",
    red: "from-red-50 to-rose-50 border-red-200"
  };
  
  return (
    <div className={`p-6 bg-gradient-to-br ${colors[color]} border rounded-xl`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xl">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="text-xl font-bold">{title}</h3>
            <span className="text-xs font-medium text-neutral-600">{time}</span>
          </div>
          <p className="text-neutral-700 mb-3 leading-relaxed">{description}</p>
          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <div className="text-xs font-bold text-neutral-500 mb-1">EXAMPLE</div>
            <div className="text-sm text-neutral-700">{example}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-neutral-900 transition-all hover:shadow-lg">
      <div className="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center mb-4 text-neutral-600">
        {icon}
      </div>
      <h3 className="font-bold mb-2 text-lg">{title}</h3>
      <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );
}