# Week 1 Sprint Plan: Duolingo Tennis SVP

> **Sprint Goal**: Validate core loop with working prototype
> **Dates**: Week of July 15-21, 2025
> **Success Metric**: 10 users complete 3-day streak

## 📋 Week 1 Deliverables

### Day 1-2: Foundation Setup
**Owner**: Technical Lead

- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up Supabase project and auth
- [ ] Create database schema (users, progress, lessons)
- [ ] Deploy to Vercel (basic "hello world")
- [ ] Set up GitHub repo with CI/CD

**Deliverable**: Working auth flow with magic links

### Day 3-4: Content & Core Loop
**Owner**: Content + Dev

- [ ] Transform first 10 lessons into JSON structure
- [ ] Build lesson player component
- [ ] Implement basic XP system
- [ ] Create streak counter (localStorage + DB)
- [ ] Add celebration animations

**Deliverable**: Can complete a lesson and earn XP

### Day 5: Minimum Viable Habit
**Owner**: Full Team

- [ ] Add daily notification system (email via Supabase)
- [ ] Create simple dashboard showing streak
- [ ] Implement "3-minute morning ritual" lesson
- [ ] Add share celebration feature
- [ ] Deploy to staging environment

**Deliverable**: Complete daily loop works end-to-end

### Weekend: Internal Testing
- [ ] Team completes 3-day streaks
- [ ] Document bugs and friction points
- [ ] Prepare for Week 2 user testing

## 🎯 Critical Path Items

### Must Have for Week 1
1. **Auth system** (magic links work)
2. **One complete lesson** (video + timer + XP)
3. **Streak tracking** (visual counter)
4. **Daily reminder** (email notification)
5. **Mobile responsive** (works on phones)

### Can Wait for Week 2
- League system
- Premium features
- Spanish content
- Video uploads
- Advanced gamification

## 👥 Team Responsibilities

### Developer
- Technical setup and deployment
- Core components (lesson player, streak)
- Database and API integration

### Designer
- Celebration animations
- Mobile-first UI
- Streak visualization

### Content
- First 10 micro-lessons scripted
- One video demonstration ready
- Tennis IQ questions prepared

### Product
- User testing recruitment
- Analytics setup
- Success metrics tracking

## 📊 Week 1 Success Metrics

### Technical
- [ ] Page load < 3 seconds
- [ ] Auth flow < 30 seconds
- [ ] Zero crashes in testing

### User Experience  
- [ ] Complete lesson in < 5 minutes
- [ ] 80% understand streak concept immediately
- [ ] 50% share celebration

### Business
- [ ] 10 internal testers recruited
- [ ] 5 complete 3-day streak
- [ ] 3 provide detailed feedback

## 🚨 Risk Mitigation

### Biggest Risks
1. **Video hosting delays**: Use YouTube unlisted for Week 1
2. **Complex animations**: Start with simple CSS transitions
3. **Database complexity**: Use localStorage first, sync later
4. **Mobile bugs**: Test on real devices daily

### Backup Plans
- If Supabase auth fails: Use NextAuth
- If videos won't load: Use GIFs temporarily  
- If notifications fail: Manual email reminders
- If Vercel issues: Deploy to Netlify

## 📝 Daily Standups

### Format
- What I completed yesterday
- What I'm working on today
- Any blockers
- User feedback received

### Key Questions
1. Is the core loop addictive?
2. Do users understand the value?
3. What's the biggest friction point?
4. Would they pay €19 for more?

## 🎬 Week 1 Demo Script

**Friday Demo to Stakeholders**:
1. Show account creation (30 sec)
2. Complete first lesson (3 min)
3. Show XP earned and streak
4. Receive next day reminder
5. Complete day 2 lesson
6. Show streak building
7. Preview premium features

**Key Message**: "Users build tennis habits in 3-minute daily sessions"

## ➡️ Week 2 Preview

Based on Week 1 learning:
- Add leagues if engagement high
- Build premium gate if demand exists
- Create Spanish version if time permits
- Expand to 30 lessons if core loop works

---

**Remember**: Week 1 is about validating the core psychological loop. Everything else can wait.