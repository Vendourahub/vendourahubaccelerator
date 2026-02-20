import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  ArrowRight, 
  Calendar, 
  Users, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  FileText 
} from "lucide-react";
import type { FounderProfile, WeeklyCommit, WeeklyReport } from "../lib/founderService";
import { wrappedFounderService as founderService } from "../lib/founderServiceWrapper";
import { getCurrentFounder } from "../lib/authManager";
import { formatCurrency } from "../lib/currency";
import { 
  getNextMonday9am, 
  getNextFriday6pm, 
  formatWATDate, 
  formatWATTime 
} from "../lib/time";
import { HelpPanel } from "../components/HelpPanel";

export default function Dashboard() {
  const [founder, setFounder] = useState<any>(null);
  const [liveProfile, setLiveProfile] = useState<FounderProfile | null>(null);
  const [commits, setCommits] = useState<WeeklyCommit[]>([]);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load founder data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const founderData = await getCurrentFounder();
        if (founderData) {
          setFounder(founderData);
        } else {
          setError("Founder profile not found. Please sign in again.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error loading founder data:", err);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Load live data from Supabase
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [profile, commitsData, reportsData] = await Promise.all([
          founderService.getMyProfile(),
          founderService.getMyCommits(),
          founderService.getMyReports()
        ]);

        if (profile) setLiveProfile(profile);
        setCommits(commitsData);
        setReports(reportsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (founder) {
      loadDashboardData();
    }
  }, [founder]);

  // Load community posts
  useEffect(() => {
    const loadCommunityPosts = async () => {
      try {
        // Load posts from localStorage instead of server
        const storedPosts = localStorage.getItem('vendoura_community_posts');
        if (storedPosts) {
          const allPosts = JSON.parse(storedPosts);
          // Get the 3 most recent posts
          const recentPosts = allPosts
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 3);
          setCommunityPosts(recentPosts);
        }
      } catch (error) {
        console.error('Error loading community posts:', error);
      }
    };

    loadCommunityPosts();
  }, []);
  
  // FounderLayout already ensures founder exists, but add safety check
  if (!founder) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-neutral-700 mb-2">Unable to load dashboard</div>
          <div className="text-sm text-neutral-500">{error || 'Please refresh or sign in again.'}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neutral-600">Loading live data...</div>
      </div>
    );
  }
  
  // Use live data if available, fallback to stored data
  const activeProfile = liveProfile || founder;
  const baseline30d = activeProfile.revenueBaseline30d || activeProfile.baseline_revenue_30d || 0;
  
  // Calculate real metrics from actual reports in Supabase
  const totalRevenueGenerated = reports.reduce((sum, report) => {
    return sum + (parseFloat(report.revenue_generated as any) || 0);
  }, 0);
  
  const currentRevenue = baseline30d + totalRevenueGenerated;
  const revenueDelta = totalRevenueGenerated;
  const growthPercentage = baseline30d > 0 ? Math.round((totalRevenueGenerated / baseline30d) * 100) : 0;
  const target2x = baseline30d * 2;
  const progressTo2x = baseline30d > 0 ? Math.min((currentRevenue / target2x) * 100, 100) : 0;
  
  const nextAction = getNextAction(activeProfile, commits, reports);
  
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {activeProfile.name?.split(' ')[0] || activeProfile.full_name?.split(' ')[0] || activeProfile.display_name || 'Founder'}. Your growth plan is ready.
        </h1>
        <p className="text-neutral-600">
          {activeProfile.business_name || activeProfile.businessName || 'Your Business'} · Week {activeProfile.current_week || activeProfile.currentWeek || 1} of 12 · Weekly actions + Friday reports
        </p>
      </div>
      
      {/* Lock Warning */}
      {activeProfile.is_locked && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-900 mb-1">Account Locked</div>
            <div className="text-sm text-red-700">{activeProfile.lock_reason || 'Complete required actions to unlock'}</div>
          </div>
        </div>
      )}
      
      {/* Quick Navigation */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link to="/commit" className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold group-hover:text-blue-700">Commit</div>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-neutral-600">Set this week's revenue action</div>
        </Link>
        
        <Link to="/execute" className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold group-hover:text-green-700">Execute</div>
            <ArrowRight className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-sm text-neutral-600">Log work and outcomes</div>
        </Link>
        
        <Link to="/calendar" className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold group-hover:text-amber-700">Calendar</div>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-neutral-600">Deadlines and check-ins</div>
        </Link>
        
        <Link to="/community" className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold group-hover:text-purple-700">Community</div>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm text-neutral-600">Share wins and get help</div>
        </Link>
      </div>
      
      {/* Revenue Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
          label="Revenue (last 30 days)"
          value={formatCurrency(currentRevenue)}
          change={`+${formatCurrency(revenueDelta)}`}
          positive={revenueDelta > 0}
        />
        
        <StatCard 
          label="Growth vs baseline"
          value={`${growthPercentage}%`}
          subtext={`Baseline: ${formatCurrency(baseline30d)}`}
        />
        
        <StatCard 
          label="Progress toward 2x"
          value={`${Math.round(progressTo2x)}%`}
          subtext={`Target: ${formatCurrency(target2x)}`}
          progress={progressTo2x}
        />
      </div>
      
      {/* Next Action */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Your next step</h2>
            <p className="text-neutral-600 text-sm">Quick action that keeps you on track</p>
          </div>
          {nextAction.urgent && (
            <div className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              Urgent
            </div>
          )}
        </div>
        
        <div className="p-6 bg-neutral-50 rounded-lg mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
              {nextAction.icon}
            </div>
            <div className="flex-1">
              <div className="font-bold mb-1">{nextAction.title}</div>
              <div className="text-sm text-neutral-600 mb-3">{nextAction.description}</div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span className={nextAction.overdue ? "text-red-600 font-medium" : "text-neutral-600"}>
                  {nextAction.deadline}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Link 
          to={nextAction.link}
          className="block w-full text-center py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
        >
          {nextAction.cta}
        </Link>
      </div>
      
      {/* Weekly Status */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <h2 className="text-xl font-bold mb-6">This week's plan</h2>
        
        <div className="space-y-4">
          <Link to="/commit">
            <StatusItem 
              label="Monday: Weekly commitment"
              status={activeProfile.current_week > 1 ? "complete" : "pending"}
              deadline="Monday 9am"
              linkText="Go to Commit"
            />
          </Link>
          
          <Link to="/execute">
            <StatusItem 
              label="Mon-Fri: Execution"
              status="in-progress"
              deadline="Throughout week"
              linkText="Log Hours"
            />
          </Link>
          
          <Link to="/report">
            <StatusItem 
              label="Friday: Revenue report"
              status="pending"
              deadline="Friday 6pm"
              linkText="Submit Report"
            />
          </Link>
          
          <Link to="/map">
            <StatusItem 
              label="Weekend: Review and adjust"
              status="pending"
              deadline="Sunday 6pm"
              linkText="Review & Adjust"
            />
          </Link>
        </div>
      </div>
      
      {/* Recent Community Activity */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent community activity</h2>
          <Link to="/community" className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {communityPosts.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No community posts yet. Be the first to share!
            </div>
          ) : (
            communityPosts.map((post: any) => (
              <Link to="/community" key={post.id} className="block p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 hover:shadow-md transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {post.author_name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-neutral-900">{post.author_name}</span>
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs font-medium">
                        {getCategoryIcon(post.category)} {post.category?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600 mb-2 line-clamp-2">
                      {post.content}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center gap-3">
                      <span>{post.likes || 0} likes</span>
                      <span>{post.comments || 0} replies</span>
                      <span>{formatTimeAgo(post.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
          
          <Link to="/community" className="px-4 py-3 bg-neutral-50 text-center rounded-lg hover:bg-neutral-100 transition-colors font-medium text-sm flex items-center justify-center gap-2 group">
            <MessageSquare className="w-4 h-4" />
            Join the discussion
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      {/* Stage Progress */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Stage {activeProfile.current_stage || activeProfile.currentStage}: {getStageName(activeProfile.current_stage || activeProfile.currentStage)}</h2>
            <p className="text-sm text-neutral-600">{getStageDescription(activeProfile.current_stage || activeProfile.currentStage)}</p>
          </div>
          <Link 
            to="/map" 
            className="text-sm text-neutral-600 hover:text-neutral-900 underline"
          >
            View full map
          </Link>
        </div>
        
        <div className="space-y-3">
          {getStageRequirements(activeProfile.current_stage || activeProfile.currentStage).map((req, i) => (
            <div key={i} className="flex items-start gap-3">
              {req.complete ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${req.complete ? 'text-neutral-600' : 'text-neutral-900'}`}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  change, 
  subtext, 
  positive,
  progress
}: { 
  label: string; 
  value: string; 
  change?: string;
  subtext?: string;
  positive?: boolean;
  progress?: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="text-sm text-neutral-600 mb-2">{label}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {change && (
        <div className={`text-sm font-medium flex items-center gap-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className="w-4 h-4" />
          {change}
        </div>
      )}
      {subtext && <div className="text-sm text-neutral-500">{subtext}</div>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neutral-900 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatusItem({ 
  label, 
  status, 
  deadline,
  linkText
}: { 
  label: string;
  status: "complete" | "pending" | "in-progress" | "missed";
  deadline: string;
  linkText?: string;
}) {
  const statusConfig = {
    complete: { icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    "in-progress": { icon: <Clock className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    pending: { icon: <Clock className="w-5 h-5" />, color: "text-neutral-600", bg: "bg-neutral-50", border: "border-neutral-200" },
    missed: { icon: <AlertCircle className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={`p-4 border-2 rounded-lg ${config.bg} ${config.border} hover:shadow-md transition-all cursor-pointer group`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={config.color}>{config.icon}</div>
          <div>
            <div className="font-medium">{label}</div>
            <div className={`text-sm ${config.color}`}>{deadline}</div>
          </div>
        </div>
        {linkText && (
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-600 group-hover:text-neutral-900">
            <span>{linkText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );
}

function getNextAction(founder: any, commits: WeeklyCommit[], reports: WeeklyReport[]) {
  const nextMonday = getNextMonday9am();
  const nextFriday = getNextFriday6pm();
  
  if (founder.current_week === 1) {
    return {
      title: "Set your first weekly action",
      description: "Pick one revenue action for this week and be specific about who, what, and expected revenue.",
      deadline: `${formatWATDate(nextMonday)} at ${formatWATTime(nextMonday)}`,
      link: "/commit",
      cta: "Write weekly commitment",
      icon: <FileText className="w-5 h-5" />,
      urgent: true,
      overdue: false
    };
  }
  
  return {
    title: "Send your revenue report",
    description: "Share this week's results with evidence so we can track progress and help you improve.",
    deadline: `${formatWATDate(nextFriday)} at ${formatWATTime(nextFriday)}`,
    link: "/report",
    cta: "Open revenue report",
    icon: <FileText className="w-5 h-5" />,
    urgent: false,
    overdue: false
  };
}

function getBusinessModelLabel(model: string) {
  const labels: Record<string, string> = {
    b2b_saas: "B2B SaaS",
    b2c_saas: "B2C SaaS",
    ecommerce: "E-commerce",
    services: "Services",
    marketplace: "Marketplace",
    other: "Other"
  };
  return labels[model] || model;
}

function getStageName(stage: number) {
  const names = ["", "Revenue Baseline", "Revenue Diagnosis", "Revenue Amplification", "Revenue System", "Revenue Scale"];
  return names[stage] || "";
}

function getStageDescription(stage: number) {
  const descriptions = [
    "",
    "Establish your current revenue capability",
    "Test 3 tactics, identify best $ per hour",
    "2x revenue from best tactic",
    "Document repeatable process",
    "Validate 4x baseline"
  ];
  return descriptions[stage] || "";
}

function getStageRequirements(stage: number) {
  if (stage === 1) {
    return [
      { label: "Complete 2 weeks of commits & reports", complete: false },
      { label: "Establish baseline $ per hour", complete: false },
      { label: "No missed deadlines", complete: false }
    ];
  }
  return [
    { label: "Complete stage requirements", complete: false }
  ];
}

function formatTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'win': return '🎉';
    case 'tactic': return '💡';
    case 'question': return '❓';
    case 'update': return '📊';
    default: return '💬';
  }
}