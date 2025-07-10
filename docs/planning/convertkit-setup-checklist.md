# ConvertKit Setup Checklist

## Required Tags to Create in ConvertKit

### 1. Core Tags (Always Applied)
- [ ] tennis-handbook
- [ ] onboarding-wizard

### 2. Language Tags
- [ ] spanish
- [ ] english  
- [ ] high-engagement-3x
- [ ] spanish-preferred

### 3. Experience Level Tags
- [ ] level-beginner
- [ ] level-intermediate
- [ ] level-advanced
- [ ] level-competitive
- [ ] segment-beginner
- [ ] segment-intermediate
- [ ] segment-advanced
- [ ] segment-competitive

### 4. Training Goal Tags
- [ ] goal-competition
- [ ] goal-fitness
- [ ] goal-technique
- [ ] goal-fun

### 5. Commitment Level Tags
- [ ] commitment-low
- [ ] commitment-medium
- [ ] commitment-high
- [ ] commitment-professional

### 6. Special Behavior Tags
- [ ] competitive-player
- [ ] injury-recovery
- [ ] high-frequency-trainer
- [ ] advanced-fitness

### 7. Communication Preference Tags
- [ ] comm-email
- [ ] comm-whatsapp
- [ ] whatsapp-enabled
- [ ] multi-channel-user
- [ ] comm-weekly_tips
- [ ] comm-pro_analysis
- [ ] comm-new_workouts
- [ ] comm-nutrition

### 8. Wizard Progress Tags
- [ ] onboarding-wizard-started
- [ ] wizard-step-updated
- [ ] wizard-completed

### 9. Email Sequence Tags
- [ ] sequence-spanish-beginner
- [ ] sequence-competitive-edge
- [ ] sequence-injury-recovery
- [ ] sequence-beginner-welcome
- [ ] sequence-intermediate-welcome
- [ ] sequence-advanced-welcome

## Required Custom Fields in ConvertKit

### Personal Information
- [ ] name (text)
- [ ] language (text)
- [ ] country (text)
- [ ] whatsapp (text)
- [ ] communication_preferences (text)

### Tennis Experience
- [ ] years_playing (text)
- [ ] current_level (text)
- [ ] plays_competitively (text)
- [ ] ranking (text)
- [ ] has_coaching (text)

### Training Goals
- [ ] primary_goal (text)
- [ ] secondary_goals (text)
- [ ] specific_challenges (text)
- [ ] has_injuries (text)
- [ ] injury_details (text)

### Schedule Preferences
- [ ] trainings_per_week (text)
- [ ] session_duration (text)
- [ ] preferred_time (text)
- [ ] commitment_level (text)
- [ ] equipment_access (text)

### Physical Profile
- [ ] age (text)
- [ ] fitness_level (text)
- [ ] dominant_hand (text)
- [ ] height (text)
- [ ] weight (text)
- [ ] has_mobility_issues (text)

### Metadata
- [ ] source (text)
- [ ] signup_date (text)
- [ ] wizard_completed (text)
- [ ] wizard_completed_at (text)
- [ ] wizard_started (text)
- [ ] wizard_started_at (text)

## How to Set Up in ConvertKit

### Creating Tags:
1. Go to ConvertKit Dashboard
2. Navigate to **Subscribers** → **Tags**
3. Click **+ Create a Tag**
4. Enter each tag name exactly as listed above
5. Save

### Creating Custom Fields:
1. Go to ConvertKit Dashboard
2. Navigate to **Subscribers** → **Custom Fields**
3. Click **+ Add Field**
4. Enter field name exactly as listed (use underscores, not spaces)
5. Set field type to "Text" for all fields
6. Save

### Testing:
1. Submit a test wizard completion
2. Check subscriber in ConvertKit
3. Verify all tags are applied
4. Verify all custom fields are populated

## Debugging Tips

If data isn't saving:
1. Check browser console for API errors
2. Check Vercel function logs for ConvertKit responses
3. Verify API key has proper permissions
4. Ensure form ID is correct for the language

Common issues:
- Tags must exist before they can be applied
- Custom fields must exist before data can be saved
- API responses will show which fields/tags failed
- Check the console logs in the Vercel function for detailed debugging