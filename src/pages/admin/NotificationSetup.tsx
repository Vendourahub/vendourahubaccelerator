import { useState, useEffect } from 'react';
import { Bell, Mail, Send, Users, Clock, Check, AlertCircle } from 'lucide-react';
import { formatWATDate } from '../../lib/time';
import { toast } from 'sonner@2.0.3';
import React from 'react';
import * as storage from '../../lib/localStorage';

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  created_at: string;
}

export default function NotificationSetup() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'onboarding' | 'applications' | 'waitlist' | 'reminders' | 'warnings' | 'achievements' | 'security' | 'admin'>('all');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      
      // Load notification templates from localStorage
      const savedTemplates = storage.getNotificationTemplates() || [];
      setTemplates(savedTemplates);
      
      // If no templates exist, create defaults
      if (savedTemplates.length === 0) {
        const defaultTemplates: NotificationTemplate[] = [
          // Onboarding
          {
            id: '1',
            name: 'Welcome to Vendoura',
            subject: 'Welcome to Vendoura Hub - Let\'s Build Revenue Together',
            body: 'Hi {{founder_name}},\n\nWelcome to Vendoura Hub! We\'re excited to have you join our revenue-focused accelerator program.\n\nYour journey to ₦10M+ revenue starts now. Here\'s what happens next:\n\n1. Complete your onboarding profile\n2. Join your cohort (starting {{cohort_start_date}})\n3. Make your first weekly commit\n4. Execute with accountability\n\nOur 5-step weekly cycle will help you build consistent revenue growth habits. Ready to get started?\n\nLogin to your dashboard: https://vendoura.com/login\n\nLet\'s build something great together!\n\nThe Vendoura Team',
            category: 'onboarding',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Registration Confirmation',
            subject: 'Your Vendoura Account Has Been Created',
            body: 'Hi {{founder_name}},\n\nYour Vendoura Hub account has been successfully created!\n\nEmail: {{founder_email}}\nBusiness: {{business_name}}\n\nNext Steps:\n1. Login at https://vendoura.com/login\n2. Complete your onboarding\n3. Set up your revenue goals\n\nIf you have any questions, reply to this email.\n\nWelcome aboard!\nVendoura Team',
            category: 'onboarding',
            created_at: new Date().toISOString()
          },
          
          // Applications
          {
            id: '3',
            name: 'Application Received',
            subject: 'We\'ve Received Your Vendoura Application',
            body: 'Hi {{founder_name}},\n\nThank you for applying to Vendoura Hub!\n\nWe\'ve received your application and will review it within 3-5 business days. Our team carefully evaluates each application to ensure we can provide maximum value to your revenue journey.\n\nWhat happens next:\n• Our team reviews your application\n• You\'ll receive a decision via email\n• Approved founders receive onboarding instructions\n\nWe review applications based on:\n✓ Revenue growth potential\n✓ Founder commitment level\n✓ Business model clarity\n✓ Coachability & execution mindset\n\nStay tuned!\nVendoura Admissions Team',
            category: 'applications',
            created_at: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Application Approved',
            subject: '🎉 Congratulations! You\'re Accepted to Vendoura Hub',
            body: 'Hi {{founder_name}},\n\nExcellent news! Your application has been APPROVED.\n\nWelcome to Vendoura Hub - you\'re now part of an elite group of revenue-focused founders committed to aggressive growth.\n\nNext Steps:\n1. Check your email for login credentials\n2. Complete onboarding (takes 10 minutes)\n3. Join the cohort starting {{cohort_start_date}}\n4. Attend the kickoff session\n\nCohort Details:\n• Program: {{cohort_name}}\n• Duration: 12 weeks\n• Start Date: {{cohort_start_date}}\n• Commitment: 5-step weekly cycle\n\nLogin now: https://vendoura.com/login\n\nLet\'s build revenue!\nVendoura Team',
            category: 'applications',
            created_at: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Application Rejected',
            subject: 'Update on Your Vendoura Application',
            body: 'Hi {{founder_name}},\n\nThank you for your interest in Vendoura Hub.\n\nAfter careful review, we\'ve decided not to move forward with your application at this time. This decision is based on current cohort fit and capacity constraints.\n\nThis doesn\'t mean your business lacks potential. Here\'s what you can do:\n\n1. Join our waitlist for the next cohort\n2. Focus on generating your first ₦500K in revenue\n3. Reapply in 3 months with updated metrics\n\nWe\'d love to see your progress. Feel free to reapply when you\'ve hit key milestones.\n\nKeep building!\nVendoura Admissions Team',
            category: 'applications',
            created_at: new Date().toISOString()
          },
          
          // Waitlist
          {
            id: '6',
            name: 'Waitlist Confirmation',
            subject: 'You\'re on the Vendoura Waitlist',
            body: 'Hi {{founder_name}},\n\nYou\'ve been added to the Vendoura Hub waitlist!\n\nEmail: {{founder_email}}\nAdded: {{waitlist_date}}\n\nWe\'ll notify you when:\n• New cohorts open for applications\n• Special early-bird spots become available\n• Program updates and success stories\n\nIn the meantime:\n→ Follow us for revenue-building tips\n→ Start tracking your weekly metrics\n→ Focus on consistent execution\n\nWe\'ll be in touch soon!\nVendoura Team',
            category: 'waitlist',
            created_at: new Date().toISOString()
          },
          {
            id: '7',
            name: 'Waitlist Invitation',
            subject: '🔓 Cohort Spots Now Open - Apply to Vendoura Hub',
            body: 'Hi {{founder_name}},\n\nGreat news! We\'re opening applications for our next cohort and you\'re on our waitlist.\n\nCohort: {{cohort_name}}\nStart Date: {{cohort_start_date}}\nSpots Available: Limited\nApplication Deadline: {{application_deadline}}\n\n👉 Apply now: https://vendoura.com/apply\n\nWaitlist members get priority review. Don\'t wait - spots fill up fast!\n\nReady to accelerate your revenue?\nVendoura Team',
            category: 'waitlist',
            created_at: new Date().toISOString()
          },
          
          // Reminders
          {
            id: '8',
            name: 'Weekly Commit Reminder',
            subject: '📝 Week {{week_number}} - Time to Submit Your Commit',
            body: 'Hi {{founder_name}},\n\nIt\'s time to make your weekly commit for Week {{week_number}}!\n\nDeadline: {{deadline}}\nCurrent Stage: Stage {{current_stage}}\n\nRemember the Vendoura commit format:\n✓ One specific revenue-driving action\n✓ Measurable outcome\n✓ Deadline within the week\n✓ Under your direct control\n\nExample: "Close 3 sales calls by Friday to generate ₦150K in revenue"\n\nLogin to submit: https://vendoura.com/commit\n\nLet\'s keep the momentum going!\nVendoura Team',
            category: 'reminders',
            created_at: new Date().toISOString()
          },
          {
            id: '9',
            name: 'Weekly Report Reminder',
            subject: '📊 Week {{week_number}} - Submit Your Weekly Report',
            body: 'Hi {{founder_name}},\n\nTime to report on your weekly commit!\n\nCommit: {{weekly_commit}}\nDeadline: {{deadline}}\nStatus: Pending Report\n\nYour report should include:\n• Did you complete your commit? (Yes/No)\n• Evidence of completion\n• Revenue generated\n• Key learnings\n• Blockers encountered\n\nLogin to report: https://vendoura.com/report\n\nAccountability drives results. Let\'s see what you achieved!\n\nVendoura Team',
            category: 'reminders',
            created_at: new Date().toISOString()
          },
          
          // Warnings
          {
            id: '10',
            name: 'Missed Deadline Warning',
            subject: '⚠️ Missed Deadline - Week {{week_number}}',
            body: 'Hi {{founder_name}},\n\nYou\'ve missed the deadline for Week {{week_number}}.\n\nMissed: {{deadline}}\nConsecutive Misses: {{consecutive_misses}}\nCurrent Stage: Stage {{current_stage}}\n\n⚠️ IMPORTANT: Three consecutive misses result in account lock.\n\nWhat to do now:\n1. Submit your report immediately\n2. Explain what happened\n3. Commit to the next week\n4. Get back on track\n\nWe believe in productive discomfort, not excuses. Let\'s get you back in the game.\n\nLogin: https://vendoura.com/report\n\nVendoura Team',
            category: 'warnings',
            created_at: new Date().toISOString()
          },
          {
            id: '11',
            name: 'Account Locked Notification',
            subject: '🔒 Your Vendoura Account Has Been Locked',
            body: 'Hi {{founder_name}},\n\nYour account has been locked due to: {{lock_reason}}\n\nConsecutive Misses: {{consecutive_misses}}\nLocked On: {{lock_date}}\n\nVendoura Hub requires consistent execution. Three consecutive misses indicate a lack of commitment to the accountability system.\n\nTo unlock your account:\n1. Schedule a call with your mentor\n2. Demonstrate renewed commitment\n3. Submit a recovery plan\n4. Get mentor approval\n\nThis isn\'t punishment - it\'s protection. We\'re here to help serious founders win.\n\nContact your mentor: {{mentor_email}}\n\nVendoura Team',
            category: 'warnings',
            created_at: new Date().toISOString()
          },
          
          // Achievements
          {
            id: '12',
            name: 'Stage Advancement',
            subject: '🎯 Congratulations! You\'ve Advanced to Stage {{stage}}',
            body: 'Hi {{founder_name}},\n\nExcellent work! You\'ve successfully advanced to Stage {{stage}}!\n\nPrevious Stage: Stage {{previous_stage}}\nNew Stage: Stage {{stage}}\nWeeks Completed: {{weeks_completed}}\nRevenue Generated: ₦{{revenue_generated}}\n\nYou\'ve unlocked:\n✓ New accountability features\n✓ Advanced revenue strategies\n✓ Stage {{stage}} resources\n✓ Peer group access\n\nStage {{stage}} focuses on:\n{{stage_focus_areas}}\n\nKeep executing with excellence!\n\nLogin: https://vendoura.com/dashboard\n\nProud of your progress,\nVendoura Team',
            category: 'achievements',
            created_at: new Date().toISOString()
          },
          {
            id: '13',
            name: 'Cohort Completion',
            subject: '🏆 Congratulations! You\'ve Completed Vendoura Hub',
            body: 'Hi {{founder_name}},\n\nCONGRATULATIONS! You\'ve completed the Vendoura Hub program!\n\nYour Stats:\n• Cohort: {{cohort_name}}\n• Weeks Completed: {{weeks_completed}}\n• Total Revenue: ₦{{total_revenue}}\n• Stage Reached: Stage {{final_stage}}\n• Completion Rate: {{completion_rate}}%\n\nWhat You\'ve Built:\n✓ Consistent execution habits\n✓ Revenue accountability systems\n✓ Weekly commitment discipline\n✓ Measurable business progress\n\nWhat\'s Next:\n→ Join our alumni community\n→ Access ongoing resources\n→ Mentor future founders\n→ Share your success story\n\nYou\'re now part of an elite group of founders who finish what they start.\n\nCongratulations, {{founder_name}}!\n\nVendoura Team',
            category: 'achievements',
            created_at: new Date().toISOString()
          },
          
          // Password & Security
          {
            id: '14',
            name: 'Password Reset Request',
            subject: 'Reset Your Vendoura Password',
            body: 'Hi {{founder_name}},\n\nWe received a request to reset your Vendoura Hub password.\n\nReset your password here:\n{{reset_link}}\n\nThis link expires in 1 hour.\n\nIf you didn\'t request this, please ignore this email. Your password will remain unchanged.\n\nFor security questions, contact: support@vendoura.com\n\nVendoura Security Team',
            category: 'security',
            created_at: new Date().toISOString()
          },
          {
            id: '15',
            name: 'Password Changed Successfully',
            subject: 'Your Vendoura Password Was Changed',
            body: 'Hi {{founder_name}},\n\nYour Vendoura Hub password was successfully changed on {{change_date}} at {{change_time}} WAT.\n\nIf you made this change, no action is needed.\n\nIf you did NOT make this change:\n1. Reset your password immediately\n2. Contact support@vendoura.com\n3. Review recent account activity\n\nYour account security is important to us.\n\nVendoura Security Team',
            category: 'security',
            created_at: new Date().toISOString()
          },
          
          // Admin Notifications
          {
            id: '16',
            name: 'New Founder Registered',
            subject: '[ADMIN] New Founder Registration - {{founder_name}}',
            body: 'New founder registered:\n\nName: {{founder_name}}\nEmail: {{founder_email}}\nBusiness: {{business_name}}\nRegistered: {{registration_date}}\n\nAction Required:\n→ Review profile\n→ Assign to cohort\n→ Send welcome email\n\nView profile: https://vendoura.com/admin/founder/{{founder_id}}',
            category: 'admin',
            created_at: new Date().toISOString()
          },
          {
            id: '17',
            name: 'Intervention Required',
            subject: '[URGENT] Intervention Needed - {{founder_name}}',
            body: 'INTERVENTION ALERT:\n\nFounder: {{founder_name}}\nIssue: {{intervention_reason}}\nConsecutive Misses: {{consecutive_misses}}\nLast Activity: {{last_activity_date}}\n\nRecommended Action:\n→ Schedule 1-on-1 call\n→ Review commitment level\n→ Assess blockers\n→ Create recovery plan\n\nView details: https://vendoura.com/admin/interventions\n\nVendoura Alert System',
            category: 'admin',
            created_at: new Date().toISOString()
          },
          {
            id: '18',
            name: 'Weekly Cohort Summary',
            subject: '[ADMIN] Week {{week_number}} Cohort Summary',
            body: 'Weekly Cohort Performance:\n\nCohort: {{cohort_name}}\nWeek: {{week_number}}\n\nMetrics:\n• Total Founders: {{total_founders}}\n• Commits Submitted: {{commits_submitted}}\n• Reports Completed: {{reports_completed}}\n• Completion Rate: {{completion_rate}}%\n• Total Revenue: ₦{{total_revenue}}\n\nFlags:\n• Founders at Risk: {{founders_at_risk}}\n• Accounts Locked: {{accounts_locked}}\n• Interventions Needed: {{interventions_needed}}\n\nView full report: https://vendoura.com/admin/analytics\n\nVendoura Analytics',
            category: 'admin',
            created_at: new Date().toISOString()
          }
        ];
        storage.setNotificationTemplates(defaultTemplates);
        setTemplates(defaultTemplates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: any) => {
    try {
      const newTemplate: NotificationTemplate = {
        id: Date.now().toString(),
        name: templateData.name,
        subject: templateData.subject,
        body: templateData.body,
        category: templateData.category,
        created_at: new Date().toISOString()
      };
      
      const updatedTemplates = [...templates, newTemplate];
      storage.setNotificationTemplates(updatedTemplates);
      setTemplates(updatedTemplates);
      
      toast.success('Template created successfully');
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const updatedTemplates = templates.filter(template => template.id !== templateId);
      storage.setNotificationTemplates(updatedTemplates);
      setTemplates(updatedTemplates);
      
      toast.success('Template deleted successfully');
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const updateTemplate = async (templateId: string, templateData: any) => {
    try {
      const updatedTemplates = templates.map(template => 
        template.id === templateId
          ? { ...template, ...templateData }
          : template
      );
      storage.setNotificationTemplates(updatedTemplates);
      setTemplates(updatedTemplates);
      
      toast.success('Template updated successfully');
      setShowEditModal(false);
      setSelectedTemplate(null);
    } catch (error: any) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Notification Setup</h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                Manage email and notification templates
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Create Template
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-sm text-neutral-600 mb-1">Total Templates</div>
            <div className="text-3xl font-bold text-neutral-900">{templates.length}</div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-sm text-neutral-600 mb-1">Active</div>
            <div className="text-3xl font-bold text-neutral-900">{templates.length}</div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Send className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-sm text-neutral-600 mb-1">Sent Today</div>
            <div className="text-3xl font-bold text-neutral-900">0</div>
          </div>
        </div>

        {/* Templates */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-bold">Notification Templates</h2>
          </div>

          {templates.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 mb-4">No templates yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Create Your First Template
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {templates.map(template => (
                <div key={template.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{template.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {template.category}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-600 mb-2">
                        <strong>Subject:</strong> {template.subject}
                      </div>
                      <div className="text-sm text-neutral-600 line-clamp-2">
                        {template.body}
                      </div>
                      <div className="text-xs text-neutral-500 mt-2">
                        Created {formatWATDate(new Date(template.created_at))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowEditModal(true);
                        }}
                        className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-blue-900 mb-1">Template Variables</div>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Use <code className="bg-blue-100 px-1 rounded">{'{{founder_name}}'}</code> for founder's name</p>
                <p>• Use <code className="bg-blue-100 px-1 rounded">{'{{business_name}}'}</code> for business name</p>
                <p>• Use <code className="bg-blue-100 px-1 rounded">{'{{week_number}}'}</code> for current week</p>
                <p>• Use <code className="bg-blue-100 px-1 rounded">{'{{deadline}}'}</code> for deadline date</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createTemplate}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTemplate && (
        <EditTemplateModal
          template={selectedTemplate}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTemplate(null);
          }}
          onUpdate={updateTemplate}
        />
      )}
    </div>
  );
}

function CreateTemplateModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (template: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    category: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.body) {
      alert('Please fill in all fields');
      return;
    }
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Create Notification Template</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="e.g., Weekly Reminder"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="general">General</option>
              <option value="reminder">Reminder</option>
              <option value="warning">Warning</option>
              <option value="celebration">Celebration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="e.g., Week {{week_number}} - Action Required"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Body
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Hi {{founder_name}}, this is a reminder..."
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditTemplateModal({ template, onClose, onUpdate }: {
  template: NotificationTemplate;
  onClose: () => void;
  onUpdate: (templateId: string, templateData: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: template.name,
    subject: template.subject,
    body: template.body,
    category: template.category
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.body) {
      alert('Please fill in all fields');
      return;
    }
    onUpdate(template.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Notification Template</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="e.g., Weekly Reminder"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="general">General</option>
              <option value="reminder">Reminder</option>
              <option value="warning">Warning</option>
              <option value="celebration">Celebration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="e.g., Week {{week_number}} - Action Required"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Body
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Hi {{founder_name}}, this is a reminder..."
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Update Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}