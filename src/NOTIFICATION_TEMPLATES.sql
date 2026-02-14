-- ============================================
-- VENDOURA HUB - EMAIL & NOTIFICATION TEMPLATES
-- ============================================
-- Run this in Supabase SQL Editor after running QUICK_FIX.sql
-- These templates support the 5-step weekly execution loop

-- Clear existing templates (if any)
TRUNCATE TABLE notification_templates;

-- ============================================
-- 1. WELCOME & ONBOARDING
-- ============================================

INSERT INTO notification_templates (name, subject, body, category) VALUES
(
  'Welcome to Vendoura Hub',
  'Welcome to Vendoura Hub - Your Revenue Acceleration Journey Starts Now! 🚀',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #000; color: #fff; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 32px;">Welcome to Vendoura Hub! 🎉</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p>Welcome to <strong>{{cohort_name}}</strong>! You''re now part of Nigeria''s most intense revenue-focused accelerator program.</p>
    
    <div style="background: #fff; border-left: 4px solid #000; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0;">⚡ What Makes Us Different:</h3>
      <ul>
        <li><strong>Productive Discomfort</strong> - We push you beyond comfort zones</li>
        <li><strong>Weekly Execution Loop</strong> - 5-step accountability system</li>
        <li><strong>Revenue-First Focus</strong> - Every action drives revenue growth</li>
        <li><strong>Sequential Unlocking</strong> - Progress through 5 stages based on performance</li>
      </ul>
    </div>
    
    <h3>📅 Your Weekly Rhythm (Every Week, WAT Time):</h3>
    <ol>
      <li><strong>Sunday 8 PM</strong> - Submit Weekly Commit (goals for the week)</li>
      <li><strong>Friday 8 PM</strong> - Submit Weekly Report (revenue + evidence)</li>
      <li><strong>Saturday</strong> - Review feedback & adjust</li>
    </ol>
    
    <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0;"><strong>⚠️ Critical Rule:</strong> Miss 3 consecutive weeks = Account LOCKED. We enforce accountability relentlessly.</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/dashboard" style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
        Access Your Dashboard →
      </a>
    </div>
    
    <p><strong>Current Status:</strong></p>
    <ul>
      <li>Stage: {{current_stage}}/5</li>
      <li>Week: {{current_week}}</li>
      <li>Subscription: {{subscription_status}}</li>
    </ul>
    
    <p>Let''s build revenue together! 💰</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
  
  <div style="background: #000; color: #fff; padding: 20px; text-align: center; font-size: 12px;">
    <p>Vendoura Hub - Revenue-Focused Accelerator<br>
    West Africa Time (WAT - UTC+1)</p>
  </div>
</body>
</html>',
  'onboarding'
);

-- ============================================
-- 2. WEEKLY REMINDERS
-- ============================================

INSERT INTO notification_templates (name, subject, body, category) VALUES
(
  'Weekly Commit Reminder',
  '⏰ Sunday Deadline: Submit Your Weekly Commit - Week {{week_number}}',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #000; padding: 30px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">⏰ Weekly Commit Due Tonight!</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p>It''s Sunday - time to submit your <strong>Week {{week_number}} Commit</strong>!</p>
    
    <div style="background: #fff; border: 2px solid #000; padding: 20px; margin: 20px 0; text-align: center;">
      <h2 style="margin: 0 0 10px 0; color: #dc3545;">Deadline: TONIGHT at 8:00 PM WAT</h2>
      <p style="margin: 0; font-size: 14px;">{{hours_remaining}} hours remaining</p>
    </div>
    
    <h3>📝 What to Include in Your Commit:</h3>
    <ol>
      <li><strong>3-5 Specific Activities</strong> you''ll complete this week</li>
      <li><strong>Revenue Goals</strong> - What ₦ amount are you targeting?</li>
      <li><strong>Evidence Plan</strong> - How will you prove completion?</li>
    </ol>
    
    <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0;"><strong>⚠️ Warning:</strong> Missing this deadline counts toward your 3-miss account lock threshold.</p>
      <p style="margin: 10px 0 0 0;">Current Misses: <strong>{{consecutive_misses}}/3</strong></p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/dashboard/weekly-commit" style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Submit Commit Now →
      </a>
    </div>
    
    <p>Stay accountable! 💪</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'reminders'
),

(
  'Weekly Report Reminder',
  '⏰ Friday Deadline: Submit Your Weekly Report - Week {{week_number}}',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #000; padding: 30px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">📊 Weekly Report Due Tonight!</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p>It''s Friday - time to submit your <strong>Week {{week_number}} Report</strong>!</p>
    
    <div style="background: #fff; border: 2px solid #000; padding: 20px; margin: 20px 0; text-align: center;">
      <h2 style="margin: 0 0 10px 0; color: #dc3545;">Deadline: TONIGHT at 8:00 PM WAT</h2>
      <p style="margin: 0; font-size: 14px;">{{hours_remaining}} hours remaining</p>
    </div>
    
    <h3>💰 What to Include in Your Report:</h3>
    <ol>
      <li><strong>Revenue Generated</strong> - Exact ₦ amount this week</li>
      <li><strong>Wins</strong> - What went well? What worked?</li>
      <li><strong>Challenges</strong> - What blocked you? Be specific.</li>
      <li><strong>Evidence</strong> - Screenshots, receipts, dashboard proofs</li>
    </ol>
    
    <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;"><strong>💡 Pro Tip:</strong> Strong evidence = Better feedback. Upload transaction screenshots, customer messages, bank statements, etc.</p>
    </div>
    
    <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0;"><strong>⚠️ Warning:</strong> Missing this deadline counts toward your 3-miss account lock threshold.</p>
      <p style="margin: 10px 0 0 0;">Current Misses: <strong>{{consecutive_misses}}/3</strong></p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/dashboard/weekly-report" style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Submit Report Now →
      </a>
    </div>
    
    <p>Let''s see those numbers! 📈</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'reminders'
);

-- ============================================
-- 3. MISSED SUBMISSIONS & WARNINGS
-- ============================================

INSERT INTO notification_templates (name, subject, body, category) VALUES
(
  'First Miss Warning',
  '⚠️ MISSED DEADLINE - Week {{week_number}} (Warning 1/3)',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #ffc107; padding: 30px; text-align: center;">
    <h1 style="color: #000; margin: 0;">⚠️ MISSED DEADLINE - Warning 1/3</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p>You <strong>MISSED</strong> the Week {{week_number}} {{submission_type}} deadline ({{deadline_date}}).</p>
    
    <div style="background: #fff; border: 3px solid #ffc107; padding: 20px; margin: 20px 0; text-align: center;">
      <h2 style="margin: 0; color: #000;">CONSECUTIVE MISSES: 1/3</h2>
      <p style="margin: 10px 0 0 0; color: #dc3545; font-weight: bold;">2 MORE MISSES = ACCOUNT LOCKED</p>
    </div>
    
    <h3>🚨 Accountability is NON-NEGOTIABLE</h3>
    <p>Vendoura Hub operates on <strong>productive discomfort</strong>. We don''t tolerate excuses - we enforce execution.</p>
    
    <p><strong>What happens next:</strong></p>
    <ul>
      <li>This miss is now on your record</li>
      <li>Your progress may be affected</li>
      <li>Miss 2 more consecutive weeks = Account LOCKED</li>
    </ul>
    
    <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;"><strong>💡 Get Back on Track:</strong></p>
      <p style="margin: 10px 0 0 0;">Submit your next deadline on time to reset your miss counter. We''re here to help you succeed.</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/dashboard" style="display: inline-block; background: #ffc107; color: #000; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View Dashboard →
      </a>
    </div>
    
    <p>Let''s get back on track! 💪</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'warnings'
),

(
  'Second Miss Warning',
  '🚨 CRITICAL: Second Missed Deadline - Week {{week_number}} (Warning 2/3)',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #ff6b6b; padding: 30px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">🚨 CRITICAL WARNING - 2/3 Misses</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p><strong style="color: #dc3545;">SECOND CONSECUTIVE MISS DETECTED.</strong></p>
    
    <p>You missed the Week {{week_number}} {{submission_type}} deadline ({{deadline_date}}).</p>
    
    <div style="background: #fff; border: 3px solid #dc3545; padding: 20px; margin: 20px 0; text-align: center;">
      <h2 style="margin: 0; color: #dc3545;">CONSECUTIVE MISSES: 2/3</h2>
      <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #dc3545;">ONE MORE MISS = ACCOUNT LOCKED 🔒</p>
    </div>
    
    <h3 style="color: #dc3545;">⚠️ THIS IS YOUR FINAL WARNING</h3>
    
    <p><strong>If you miss the next deadline:</strong></p>
    <ul style="color: #dc3545; font-weight: bold;">
      <li>Your account will be IMMEDIATELY LOCKED</li>
      <li>You will lose access to all program resources</li>
      <li>Re-entry is NOT guaranteed</li>
      <li>Refunds are NOT provided</li>
    </ul>
    
    <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0;"><strong>Need Help?</strong></p>
      <p style="margin: 10px 0 0 0;">If you''re struggling, reach out NOW. We can provide guidance, but you MUST take action.</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/dashboard" style="display: inline-block; background: #dc3545; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Take Action NOW →
      </a>
    </div>
    
    <p style="font-weight: bold;">The next deadline is your last chance. Don''t waste it.</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'warnings'
),

(
  'Account Locked Notification',
  '🔒 ACCOUNT LOCKED - 3 Consecutive Misses - Immediate Action Required',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #dc3545; padding: 30px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">🔒 ACCOUNT LOCKED</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p><strong style="color: #dc3545; font-size: 20px;">Your Vendoura Hub account has been LOCKED.</strong></p>
    
    <div style="background: #fff; border: 3px solid #dc3545; padding: 20px; margin: 20px 0; text-align: center;">
      <h2 style="margin: 0; color: #dc3545;">3 CONSECUTIVE MISSES</h2>
      <p style="margin: 10px 0 0 0; font-weight: bold;">Accountability threshold exceeded</p>
    </div>
    
    <h3>📋 Lock Details:</h3>
    <ul>
      <li><strong>Reason:</strong> {{lock_reason}}</li>
      <li><strong>Missed Weeks:</strong> {{missed_weeks}}</li>
      <li><strong>Locked On:</strong> {{lock_date}}</li>
      <li><strong>Account Status:</strong> LOCKED</li>
    </ul>
    
    <h3>🚨 What This Means:</h3>
    <ul>
      <li>❌ Dashboard access REVOKED</li>
      <li>❌ No access to program resources</li>
      <li>❌ No further mentorship or support</li>
      <li>❌ Cannot submit weekly activities</li>
    </ul>
    
    <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0;"><strong>⚠️ Important:</strong></p>
      <ul style="margin: 10px 0 0 0;">
        <li>No refunds are provided for locked accounts</li>
        <li>Re-entry is at admin discretion only</li>
        <li>You may appeal within 48 hours</li>
      </ul>
    </div>
    
    <h3>📞 Appeal Process:</h3>
    <p>If you believe this lock was made in error or have extenuating circumstances, email:</p>
    <p style="text-align: center; font-size: 18px; font-weight: bold;">
      <a href="mailto:support@vendoura.com" style="color: #000;">support@vendoura.com</a>
    </p>
    
    <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;"><strong>💡 Lesson:</strong></p>
      <p style="margin: 10px 0 0 0;">Vendoura Hub is built on accountability. Success requires consistent execution, not excuses. We hope you''ve learned from this experience.</p>
    </div>
    
    <p>We wish you success in your future endeavors.</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'warnings'
);

-- ============================================
-- 4. INTERVENTIONS
-- ============================================

INSERT INTO notification_templates (name, subject, body, category) VALUES
(
  'Intervention Required',
  '⚠️ Intervention Required - Your Account Needs Attention',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #ffc107; padding: 30px; text-align: center;">
    <h1 style="color: #000; margin: 0;">⚠️ Intervention Notice</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p>Our system has flagged your account for <strong>immediate intervention</strong>.</p>
    
    <div style="background: #fff; border: 2px solid #ffc107; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0;">📊 Intervention Reason:</h3>
      <p style="margin: 0; font-size: 16px;"><strong>{{intervention_reason}}</strong></p>
    </div>
    
    <h3>📈 Your Current Status:</h3>
    <ul>
      <li><strong>Consecutive Misses:</strong> {{consecutive_misses}}/3</li>
      <li><strong>Current Stage:</strong> {{current_stage}}/5</li>
      <li><strong>Baseline Revenue (30d):</strong> ₦{{baseline_revenue_30d}}</li>
      <li><strong>Recent Revenue:</strong> ₦{{recent_revenue}}</li>
    </ul>
    
    <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;"><strong>💬 What Happens Next:</strong></p>
      <p style="margin: 10px 0 0 0;">A member of our team will reach out within 24-48 hours to discuss your progress and provide support.</p>
    </div>
    
    <h3>🎯 Recommended Actions:</h3>
    <ol>
      <li>Review your recent submissions for quality</li>
      <li>Ensure you''re meeting ALL weekly deadlines</li>
      <li>Focus on revenue-generating activities</li>
      <li>Provide strong evidence for all claims</li>
    </ol>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/dashboard" style="display: inline-block; background: #ffc107; color: #000; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View Your Dashboard →
      </a>
    </div>
    
    <p>We''re here to help you get back on track! 💪</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'interventions'
),

(
  'Intervention Resolved',
  '✅ Intervention Resolved - Great Work Getting Back on Track!',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #28a745; padding: 30px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">✅ Intervention Resolved!</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p><strong>Great news!</strong> Your intervention has been marked as <strong>RESOLVED</strong>. 🎉</p>
    
    <div style="background: #d4edda; border: 2px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <h3 style="margin: 0 0 10px 0; color: #155724;">✅ Resolution Notes:</h3>
      <p style="margin: 0;">{{resolution_notes}}</p>
    </div>
    
    <h3>📊 Updated Status:</h3>
    <ul>
      <li><strong>Consecutive Misses:</strong> {{consecutive_misses}}/3</li>
      <li><strong>Account Status:</strong> {{account_status}}</li>
      <li><strong>Current Stage:</strong> {{current_stage}}/5</li>
    </ul>
    
    <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;"><strong>💡 Keep Up the Momentum:</strong></p>
      <p style="margin: 10px 0 0 0;">Continue meeting deadlines, providing strong evidence, and focusing on revenue. You''ve proven you can do this - now maintain it!</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/dashboard" style="display: inline-block; background: #28a745; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Continue Your Journey →
      </a>
    </div>
    
    <p>Proud of your progress! Keep going! 🚀</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'interventions'
);

-- ============================================
-- 5. STAGE PROGRESSION
-- ============================================

INSERT INTO notification_templates (name, subject, body, category) VALUES
(
  'Stage Unlocked',
  '🎉 STAGE {{new_stage}} UNLOCKED - You''re Leveling Up!',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 36px;">🎉 STAGE {{new_stage}} UNLOCKED!</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p><strong>Congratulations!</strong> You''ve unlocked <strong>Stage {{new_stage}}</strong>! 🚀</p>
    
    <div style="background: #fff; border: 3px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 10px; text-align: center;">
      <h2 style="margin: 0 0 10px 0; color: #667eea;">PROGRESS</h2>
      <p style="margin: 0; font-size: 48px; font-weight: bold;">{{new_stage}}/5</p>
      <p style="margin: 10px 0 0 0;">Stages Completed</p>
    </div>
    
    <h3>🎯 Stage {{new_stage}}: {{stage_name}}</h3>
    <p>{{stage_description}}</p>
    
    <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;"><strong>✨ What''s New in This Stage:</strong></p>
      <ul style="margin: 10px 0 0 0;">
        {{new_features}}
      </ul>
    </div>
    
    <h3>📊 Your Achievement Stats:</h3>
    <ul>
      <li><strong>Weeks Completed:</strong> {{weeks_completed}}</li>
      <li><strong>Revenue Growth:</strong> {{revenue_growth}}%</li>
      <li><strong>Consistency Score:</strong> {{consistency_score}}/100</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Explore Stage {{new_stage}} →
      </a>
    </div>
    
    <p>Keep crushing it! You''re building something special. 💪</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'achievements'
);

-- ============================================
-- 6. WAITLIST NOTIFICATIONS
-- ============================================

INSERT INTO notification_templates (name, subject, body, category) VALUES
(
  'Waitlist Welcome',
  'You''re on the Vendoura Hub Waitlist! 🎉',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #667eea; padding: 30px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">Welcome to the Waitlist! 🎉</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{name}}</strong>,</p>
    
    <p>Thank you for your interest in <strong>Vendoura Hub</strong>!</p>
    
    <p>You''ve been added to our waitlist. We''ll notify you as soon as spots open up in the next cohort.</p>
    
    <div style="background: #fff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0;">🚀 What is Vendoura Hub?</h3>
      <p>Nigeria''s most intense revenue-focused accelerator. We use <strong>productive discomfort</strong> to push founders beyond their limits through:</p>
      <ul>
        <li>5-step weekly execution loop</li>
        <li>Sequential stage unlocking based on performance</li>
        <li>Strict accountability (miss 3 weeks = account locked)</li>
        <li>Revenue-first mentorship</li>
      </ul>
    </div>
    
    <h3>⏰ What Happens Next:</h3>
    <ol>
      <li>We''ll email you when the next cohort opens</li>
      <li>You''ll get priority access to apply</li>
      <li>Limited spots available (first-come, first-served)</li>
    </ol>
    
    <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;"><strong>💡 While You Wait:</strong></p>
      <ul style="margin: 10px 0 0 0;">
        <li>Follow us on social media for updates</li>
        <li>Join our community WhatsApp group</li>
        <li>Review your business revenue strategy</li>
      </ul>
    </div>
    
    <p><strong>Your Waitlist Details:</strong></p>
    <ul>
      <li><strong>Joined:</strong> {{joined_date}}</li>
      <li><strong>Email:</strong> {{email}}</li>
      <li><strong>Position:</strong> We''ll notify in order received</li>
    </ul>
    
    <p>Talk soon! 🚀</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'waitlist'
),

(
  'Cohort Opening Soon',
  '🚀 Cohort Opening Soon - Get Ready to Join Vendoura Hub!',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #28a745; padding: 30px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">🚀 {{cohort_name}} Opening Soon!</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{name}}</strong>,</p>
    
    <p><strong>Exciting news!</strong> The next cohort is opening soon, and you''re on the list! 🎉</p>
    
    <div style="background: #fff; border: 3px solid #28a745; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px;">
      <h2 style="margin: 0 0 10px 0; color: #28a745;">{{cohort_name}}</h2>
      <p style="margin: 0; font-size: 18px;"><strong>Opens:</strong> {{opening_date}}</p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">{{spots_available}} spots available</p>
    </div>
    
    <h3>⚡ Quick Cohort Details:</h3>
    <ul>
      <li><strong>Duration:</strong> 20 weeks</li>
      <li><strong>Investment:</strong> ₦{{price}}</li>
      <li><strong>Start Date:</strong> {{start_date}}</li>
      <li><strong>Format:</strong> Online (WAT timezone)</li>
    </ul>
    
    <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0;"><strong>⚠️ Act Fast:</strong></p>
      <p style="margin: 10px 0 0 0;">Spots fill up in hours. Registration link will be sent on {{opening_date}}.</p>
    </div>
    
    <h3>✅ Prepare Now:</h3>
    <ol>
      <li>Have your business details ready</li>
      <li>Prepare baseline revenue numbers (last 30 days)</li>
      <li>Be ready to commit to weekly submissions</li>
      <li>Payment details ready (Paystack/Flutterwave)</li>
    </ol>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com" style="display: inline-block; background: #28a745; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Learn More →
      </a>
    </div>
    
    <p>Get ready to accelerate your revenue! 💰</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'waitlist'
);

-- ============================================
-- 7. ADMIN NOTIFICATIONS
-- ============================================

INSERT INTO notification_templates (name, subject, body, category) VALUES
(
  'Admin Intervention Alert',
  '[ADMIN] Intervention Required - {{founder_name}}',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #dc3545; padding: 20px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">⚠️ ADMIN ALERT: Intervention Required</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <h2>Founder: {{founder_name}}</h2>
    
    <div style="background: #fff; border: 2px solid #dc3545; padding: 15px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0;">Intervention Details:</h3>
      <ul style="margin: 0;">
        <li><strong>Reason:</strong> {{intervention_reason}}</li>
        <li><strong>Priority:</strong> {{priority}}</li>
        <li><strong>Flagged:</strong> {{flagged_date}}</li>
      </ul>
    </div>
    
    <h3>Founder Stats:</h3>
    <ul>
      <li><strong>Email:</strong> {{founder_email}}</li>
      <li><strong>Business:</strong> {{business_name}}</li>
      <li><strong>Consecutive Misses:</strong> {{consecutive_misses}}/3</li>
      <li><strong>Current Stage:</strong> {{current_stage}}/5</li>
      <li><strong>Current Week:</strong> {{current_week}}</li>
      <li><strong>Baseline Revenue:</strong> ₦{{baseline_revenue}}</li>
      <li><strong>Recent Revenue:</strong> ₦{{recent_revenue}}</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/admin/interventions" style="display: inline-block; background: #dc3545; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Review Intervention →
      </a>
    </div>
    
    <p><strong>Action Required:</strong> Review and respond within 24 hours.</p>
  </div>
</body>
</html>',
  'admin'
),

(
  'Admin Weekly Summary',
  '[ADMIN] Weekly Summary - Week {{week_number}} - {{cohort_name}}',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: #000; padding: 30px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">📊 Week {{week_number}} Summary</h1>
    <p style="color: #fff; margin: 10px 0 0 0;">{{cohort_name}}</p>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <h2>Platform Statistics</h2>
    
    <div style="background: #fff; border: 2px solid #000; padding: 20px; margin: 20px 0; border-radius: 10px;">
      <h3 style="margin: 0 0 15px 0;">Weekly Performance</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div style="text-align: center;">
          <div style="font-size: 32px; font-weight: bold;">{{submission_rate}}%</div>
          <div style="font-size: 14px; color: #666;">Submission Rate</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 32px; font-weight: bold;">₦{{total_revenue}}</div>
          <div style="font-size: 14px; color: #666;">Total Revenue</div>
        </div>
      </div>
    </div>
    
    <h3>📊 Detailed Stats:</h3>
    <ul>
      <li><strong>Total Founders:</strong> {{total_founders}}</li>
      <li><strong>Active Founders:</strong> {{active_founders}}</li>
      <li><strong>Commits Submitted:</strong> {{commits_submitted}}/{{total_founders}}</li>
      <li><strong>Reports Submitted:</strong> {{reports_submitted}}/{{total_founders}}</li>
      <li><strong>New Interventions:</strong> {{new_interventions}}</li>
      <li><strong>Accounts Locked:</strong> {{accounts_locked}}</li>
    </ul>
    
    <h3>⚠️ Attention Required:</h3>
    <ul>
      <li><strong>Pending Interventions:</strong> {{pending_interventions}}</li>
      <li><strong>Founders at Risk (2 misses):</strong> {{at_risk_founders}}</li>
      <li><strong>Evidence to Review:</strong> {{evidence_pending}}</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/admin" style="display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View Admin Dashboard →
      </a>
    </div>
  </div>
</body>
</html>',
  'admin'
);

-- ============================================
-- 8. SUCCESS & MOTIVATION
-- ============================================

INSERT INTO notification_templates (name, subject, body, category) VALUES
(
  'Milestone Achieved',
  '🎉 Milestone Achieved: {{milestone_name}}!',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 36px;">🎉 MILESTONE ACHIEVED!</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 18px;">Hi <strong>{{founder_name}}</strong>,</p>
    
    <p><strong>Congratulations!</strong> You just hit a major milestone! 🚀</p>
    
    <div style="background: #fff; border: 3px solid #f5576c; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px;">
      <h2 style="margin: 0 0 10px 0; color: #f5576c;">{{milestone_name}}</h2>
      <p style="margin: 0; font-size: 16px;">{{milestone_description}}</p>
    </div>
    
    <h3>🎯 Your Achievement:</h3>
    <p>{{achievement_details}}</p>
    
    <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
      <p style="margin: 0;"><strong>💪 Keep Building Momentum:</strong></p>
      <p style="margin: 10px 0 0 0;">This is just the beginning. Your consistency is paying off. Keep executing!</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://vendoura.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        View Progress →
      </a>
    </div>
    
    <p>Proud of you! 🌟</p>
    
    <p>Best regards,<br>
    <strong>Vendoura Hub Team</strong></p>
  </div>
</body>
</html>',
  'achievements'
);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ SUCCESS! All notification templates created!';
  RAISE NOTICE '📧 Templates created:';
  RAISE NOTICE '  ✉️  Welcome & Onboarding (1)';
  RAISE NOTICE '  ⏰ Weekly Reminders (2)';
  RAISE NOTICE '  ⚠️  Missed Submissions & Warnings (3)';
  RAISE NOTICE '  🚨 Interventions (2)';
  RAISE NOTICE '  🎯 Stage Progression (1)';
  RAISE NOTICE '  📋 Waitlist (2)';
  RAISE NOTICE '  👨‍💼 Admin Notifications (2)';
  RAISE NOTICE '  🎉 Success & Motivation (1)';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Total: 14 email templates ready to use!';
END $$;
