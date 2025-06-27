'use server';

import { createClient } from '@/lib/supabase/server';
import { onboardingSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateReferralCode } from '@/lib/referral-utils';
import { logger } from '@/lib/logger';

// Function to send family invitation emails
async function sendFamilyInviteEmails(familyMembers: any[], adminName: string, adminId: string) {
  try {
    logger.step('Sending family invitation emails', { memberCount: familyMembers.length });
    
    const invitePromises = familyMembers.map(async (member) => {
      const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/signup?family_admin_id=${adminId}`;
      
      // Create the email content
      const emailSubject = `${adminName} invited you to join SupplementScribe AI`;
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>You're Invited to SupplementScribe AI</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 You're Invited!</h1>
              <p>Join ${adminName}'s family health plan</p>
            </div>
            <div class="content">
              <h2>Hi ${member.name}!</h2>
              <p>${adminName} has invited you to join their family plan on <strong>SupplementScribe AI</strong> - the personalized supplement recommendation platform.</p>
              
              <p><strong>What this means for you:</strong></p>
              <ul>
                <li>🎯 Get your own personalized supplement recommendations</li>
                <li>🧬 AI-powered health analysis based on your unique profile</li>
                <li>💊 Custom 6-supplement protocol tailored to your needs</li>
                <li>👨‍👩‍👧‍👦 Be part of ${adminName}'s family health journey</li>
              </ul>
              
              <p>Click the button below to create your account and start your personalized health assessment:</p>
              
              <a href="${inviteUrl}" class="button">Join Family Plan & Get Started</a>
              
              <p><small>Or copy and paste this link: ${inviteUrl}</small></p>
              
              <div class="footer">
                <p>This invitation was sent by ${adminName} through SupplementScribe AI</p>
                <p>If you don't want to receive these emails, you can ignore this message.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email using Supabase Edge Function
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: member.email,
            subject: emailSubject,
            html: emailHtml,
            from: 'SupplementScribe AI <noreply@supplementscribe.ai>'
          }),
        });

        if (!emailResponse.ok) {
          logger.error(`Failed to send invite to ${member.email}`, { error: await emailResponse.text() });
          return { success: false, email: member.email, error: 'Failed to send' };
        } else {
          logger.success(`Invite sent successfully to ${member.email}`);
          return { success: true, email: member.email };
        }
      } else {
        logger.error('No session token for sending emails');
        return { success: false, email: member.email, error: 'No auth token' };
      }
    });

    const results = await Promise.all(invitePromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    logger.info(`Family invites sent: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
    
  } catch (error) {
    logger.error('Error sending family invitation emails', error instanceof Error ? error : { message: String(error) });
    return { successful: 0, failed: familyMembers.length, error };
  }
}

export async function saveOnboardingData(formData: unknown, familySetupData?: any) {
  try {
    logger.step('Saving onboarding data');
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to submit this form.',
      };
    }

    const result = onboardingSchema.safeParse(formData);

    if (!result.success) {
      logger.error('Form validation failed', { errors: result.error.flatten() });
      return { success: false, error: 'Invalid form data provided.' };
    }

    const {
      fullName,
      age,
      gender,
      height_ft,
      height_in,
      weight_lbs,
      healthGoals,
      customHealthGoal,
      subscription_tier,
      // Shipping Address Fields - CRITICAL for upselling
      shipping_name,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      shipping_phone,
      allergies,
      conditions,
      medications,
      activity_level,
      sleep_hours,
      alcohol_intake,
      dietary_preference, // 🚨 CRITICAL FIX: Add missing dietary_preference
      // 16 Lifestyle Assessment Questions (Yes/No)
      energy_levels,
      effort_fatigue,
      caffeine_effect,
      digestive_issues,
      stress_levels,
      sleep_quality,
      mood_changes,
      brain_fog,
      sugar_cravings,
      skin_issues,
      joint_pain,
      immune_system,
      workout_recovery,
      food_sensitivities,
      weight_management,
      medication_history, // ADHD/Anxiety meds question
      primary_health_concern,
      known_biomarkers,
      known_genetic_variants,
    } = result.data;

    const height_total_inches = (height_ft * 12) + height_in;
    
    // Combine health goals (excluding 'custom' placeholder) and add custom goal if provided
    const combinedHealthGoals = healthGoals.filter(goal => goal !== 'custom');
    if (customHealthGoal && customHealthGoal.trim()) {
      combinedHealthGoals.push(customHealthGoal.trim());
    }

    // Generate unique referral code for this user
    let userReferralCode = generateReferralCode();
    
    // Ensure uniqueness by checking database
    let codeExists = true;
    let attempts = 0;
    while (codeExists && attempts < 10) {
      const { data: existingCode } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('referral_code', userReferralCode)
        .single();
      
      if (!existingCode) {
        codeExists = false;
      } else {
        userReferralCode = generateReferralCode();
        attempts++;
      }
    }

    // Handle referral tracking (who referred this user)
    let referredByCode = null;
    try {
      // Note: We can't access localStorage from server actions,
      // so we'll need to pass this from the client if needed
      // For now, we'll handle this in a future update
    } catch (error) {
      logger.debug('No referral code found');
    }

    // Handle family setup data
    let familyAdminId = null;
    let familySize = null;
    
    if (familySetupData?.isAdmin) {
      // This user is the family admin
      familyAdminId = user.id;
      familySize = familySetupData.familySize;
      logger.info(`Setting up family admin with ${familySize} total members`);
    } else if (familySetupData?.familyAdminId) {
      // This user is joining an existing family
      familyAdminId = familySetupData.familyAdminId;
      logger.info(`Joining family with admin ID: ${familyAdminId}`);
    }
    
    // Upsert Profile Data with new fields
    const profileData: any = {
      id: user.id,
      full_name: fullName,
      age: age,
      gender: gender,
      height_total_inches: height_total_inches,
      weight_lbs: weight_lbs,
      health_goals: combinedHealthGoals,
      subscription_tier,
      
      // Shipping Address Fields - CRITICAL for upselling and order fulfillment
      shipping_name,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      shipping_phone,

      activity_level,
      sleep_hours,
      alcohol_intake,
      dietary_preference, // 🚨 CRITICAL FIX: Add missing dietary_preference
      // 16 Lifestyle Assessment Questions (Yes/No)
      energy_levels,
      effort_fatigue,
      caffeine_effect,
      digestive_issues,
      stress_levels,
      sleep_quality,
      mood_changes,
      brain_fog,
      sugar_cravings,
      skin_issues,
      joint_pain,
      immune_system,
      workout_recovery,
      food_sensitivities,
      weight_management,
      medication_history, // ADHD/Anxiety meds question
      primary_health_concern,
      known_biomarkers,
      known_genetic_variants,
      
      // Referral system fields
      referral_code: userReferralCode,
      referred_by_code: referredByCode,
      
      updated_at: new Date().toISOString(),
    };

    // Add family fields if this is a family setup
    if (familyAdminId && familySize) {
      profileData.family_admin_id = familyAdminId;
      profileData.family_size = familySize;
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'id' });

    if (profileError) {
      logger.error('Error upserting profile', profileError);
      return { success: false, error: 'Failed to save profile information.' };
    }
    
    // Clear and re-insert allergies, conditions, medications
    const { error: deleteAllergiesError } = await supabase.from('user_allergies').delete().eq('user_id', user.id);
    const { error: deleteConditionsError } = await supabase.from('user_conditions').delete().eq('user_id', user.id);
    const { error: deleteMedicationsError } = await supabase.from('user_medications').delete().eq('user_id', user.id);

    if (deleteAllergiesError || deleteConditionsError || deleteMedicationsError) {
      logger.error('Error clearing old data', { deleteAllergiesError, deleteConditionsError, deleteMedicationsError });
      return { success: false, error: 'Failed to clear existing health profile data.' };
    }

    // Insert allergies
    if (allergies?.length) {
      const allergyInserts = allergies.filter(a => a.value.trim()).map(a => ({ user_id: user.id, ingredient_name: a.value }));
      if (allergyInserts.length > 0) {
        const { error: allergyError } = await supabase.from('user_allergies').insert(allergyInserts);
        if (allergyError) {
          logger.error('Error inserting allergies', allergyError);
          return { success: false, error: 'Failed to save allergy information.' };
        }
      }
    }

    // Insert conditions
    if (conditions?.length) {
      const conditionInserts = conditions.filter(c => c.value.trim()).map(c => ({ user_id: user.id, condition_name: c.value }));
      if (conditionInserts.length > 0) {
        const { error: conditionError } = await supabase.from('user_conditions').insert(conditionInserts);
        if (conditionError) {
          logger.error('Error inserting conditions', conditionError);
          return { success: false, error: 'Failed to save medical condition information.' };
        }
      }
    }

    // Insert medications
    if (medications?.length) {
      const medicationInserts = medications.filter(m => m.value.trim()).map(m => ({ user_id: user.id, medication_name: m.value }));
      if (medicationInserts.length > 0) {
        const { error: medicationError } = await supabase.from('user_medications').insert(medicationInserts);
        if (medicationError) {
          logger.error('Error inserting medications', medicationError);
          return { success: false, error: 'Failed to save medication information.' };
        }
      }
    }

    // ✅ SUCCESS: Onboarding data saved - AI functions now called AFTER payment
    logger.success('Onboarding data saved successfully! AI functions will be called after payment.');
    
    // 🚧 PAYMENT GATE: AI functions moved to payment success handler
    // The generate-plan and health-domains-analysis functions are now called
    // in the payment success page AFTER payment is confirmed
    
    // COMMENTED OUT: AI generation now happens after payment
    /*
    try {
      // Get user session token for authenticated edge function call
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        // Call generate-plan function with user's access token
        const planResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-plan`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!planResponse.ok) {
          logger.error('Failed to generate plan', { error: await planResponse.text() });
          // Don't fail the onboarding if plan generation fails
        } else {
          logger.success('Supplement plan generated successfully');
          
          // 🔬 GENERATE AI-POWERED HEALTH DOMAINS ANALYSIS
          logger.step('Generating AI-powered health domains analysis');
          try {
            const domainsResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/health-domains-analysis`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({}),
            });

            if (!domainsResponse.ok) {
              logger.error('Failed to generate health domains analysis', { error: await domainsResponse.text() });
              // Don't fail the onboarding if domains analysis fails
            } else {
              logger.success('Health domains analysis generated successfully');
            }
          } catch (domainsError) {
            logger.error('Error generating health domains analysis', domainsError instanceof Error ? domainsError : { message: String(domainsError) });
            // Don't fail the onboarding if domains analysis fails
          }
        }
      } else {
        logger.error('No session token available for plan generation');
      }
    } catch (planError) {
      logger.error('Error generating plan', planError instanceof Error ? planError : { message: String(planError) });
      // Don't fail the onboarding if plan generation fails
    }
    */

    // 🎯 SEND FAMILY INVITES if this is a family admin
    if (familySetupData?.isAdmin && familySetupData?.familyMembers?.length > 0) {
      logger.step('Sending family invitation emails');
      try {
        const inviteResults = await sendFamilyInviteEmails(
          familySetupData.familyMembers,
          fullName,
          user.id
        );
        
        if (inviteResults.successful > 0) {
          logger.success(`Successfully sent ${inviteResults.successful} family invitations`);
        }
        
        if (inviteResults.failed > 0) {
          logger.warn(`Failed to send ${inviteResults.failed} family invitations`);
        }
      } catch (inviteError) {
        logger.error('Error sending family invitations', inviteError instanceof Error ? inviteError : { message: String(inviteError) });
        // Don't fail the onboarding if invite sending fails
      }
    }

    // Revalidate and redirect to dashboard
    revalidatePath('/dashboard');
    
    return {
      success: true,
      message: 'Profile saved successfully! Your personalized supplement plan is being generated.',
    };

  } catch (error: any) {
    logger.error('Error in saveOnboardingData', error instanceof Error ? error : { message: String(error) });
    return {
      success: false,
      error: error.message || 'An unexpected error occurred.',
    };
  }
}

// NEW FUNCTION: Generate AI content after payment
export async function generateAIContentAfterPayment() {
  const supabase = await createClient();
  
  try {
    // Get user session token for authenticated edge function call
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No session token available for plan generation');
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No user found');
    }

    logger.info('Checking for user profile', { userId: user.id });

    // Check if user profile exists (it should, since we saved it before payment)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_tier, full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      logger.error('Profile query error', profileError);
      throw new Error(`Database error: ${profileError.message}`);
    }

    if (!profile) {
      logger.error('No profile found for user', { userId: user.id });
      
      // Let's try to see if there are ANY profiles for this user
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id);
      
      logger.error('All profiles check', { allProfiles, allProfilesError });
      
      throw new Error('User profile not found. Please complete onboarding first.');
    }

    logger.success('User profile found', { 
      fullName: profile.full_name, 
      subscriptionTier: profile.subscription_tier 
    });

    // Shipping address is already saved during onboarding before payment
    // No need to update it here since we save onboarding data to Supabase first

    logger.step('🚀 PARALLEL EXECUTION: Generating ALL AI content simultaneously');
    
    // 🎯 RUN ALL 4 AI FUNCTIONS IN PARALLEL FOR MAXIMUM SPEED
    const aiGenerationPromises = [
      // 1. Generate supplement plan
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Generate Plan: ${errorText}`);
        }
        return { function: 'generate-plan', success: true };
      }).catch(error => ({ function: 'generate-plan', success: false, error: error.message })),

      // 2. Generate health domains analysis
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/health-domains-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Health Domains: ${errorText}`);
        }
        return { function: 'health-domains-analysis', success: true };
      }).catch(error => ({ function: 'health-domains-analysis', success: false, error: error.message })),

      // 3. Generate health score
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/health-score`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Health Score: ${errorText}`);
        }
        return { function: 'health-score', success: true };
      }).catch(error => ({ function: 'health-score', success: false, error: error.message })),

      // 4. Generate diet plan
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-diet-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Diet Plan: ${errorText}`);
        }
        return { function: 'generate-diet-plan', success: true };
      }).catch(error => ({ function: 'generate-diet-plan', success: false, error: error.message }))
    ];

    // Wait for ALL functions to complete (successful or failed)
    const results = await Promise.allSettled(aiGenerationPromises);
    
    // Process results and log outcomes
    let successCount = 0;
    let failureCount = 0;
    const failedFunctions: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const functionResult = result.value;
        if (functionResult.success) {
          successCount++;
          logger.success(`✅ ${functionResult.function} completed successfully`);
        } else {
          failureCount++;
          failedFunctions.push(functionResult.function);
          logger.error(`❌ ${functionResult.function} failed: ${'error' in functionResult ? functionResult.error : 'Unknown error'}`);
        }
      } else {
        failureCount++;
        const functionNames = ['generate-plan', 'health-domains-analysis', 'health-score', 'generate-diet-plan'];
        failedFunctions.push(functionNames[index]);
        logger.error(`❌ ${functionNames[index]} promise rejected: ${result.reason}`);
      }
    });

    // Log summary
    logger.success(`🎯 PARALLEL EXECUTION COMPLETE: ${successCount}/4 functions successful`);
    
    if (failureCount > 0) {
      logger.warn(`⚠️ ${failureCount} functions failed: ${failedFunctions.join(', ')}`);
      logger.info('Dashboard will show fallback messages for failed functions');
    }

    // Consider it successful if at least the supplement plan generated
    // (since that's the core feature users pay for)
    const planResult = results[0];
    const planSuccessful = planResult.status === 'fulfilled' && 
                          (planResult.value as any).success === true;

    if (!planSuccessful) {
      logger.error('❌ CRITICAL: Supplement plan generation failed - this is the core paid feature');
      throw new Error('Failed to generate supplement plan - the core feature you paid for');
    }

    return { 
      success: true, 
      successfulFunctions: successCount,
      failedFunctions: failedFunctions,
      message: `AI content generation completed: ${successCount}/4 functions successful`
    };

  } catch (error: any) {
    logger.error('Error generating AI content', error instanceof Error ? error : { message: String(error) });
    return { 
      success: false, 
      error: error.message || 'Failed to generate AI content' 
    };
  }
} 