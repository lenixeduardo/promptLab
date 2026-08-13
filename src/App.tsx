import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { LivesProvider } from "@/contexts/LivesContext"
import { AchievementsProvider } from "@/contexts/AchievementsContext"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AvatarProvider } from "@/components/AvatarProvider"
import { PremiumProvider } from "@/components/PremiumProvider"
import { PrivateRoute } from "@/components/PrivateRoute"
import { LoadingScreen } from "@/components/LoadingScreen"
import { Toaster } from "sileo"
import "sileo/styles.css"
import { initAnalytics, pageView, identify, reset } from "@/lib/analytics"
import { initUserScope } from "@/lib/userScope"
import { useAuth } from "@/hooks/useAuth"
import { completeMission } from "@/lib/missions"
import { useUTM } from "@/hooks/useUTM"
import { useInactiveReminder } from "@/hooks/useInactiveReminder"
import { QuickEnhanceModal } from "@/components/QuickEnhanceModal"
import { WelcomeBackScreen } from "@/components/WelcomeBackScreen"
import { useAchievements } from "@/hooks/useAchievements"
import { AppLayout } from "@/components/AppLayout"
import { ErrorRecoveryPanel } from "@/components/ErrorRecoveryPanel"
import { ErrorRecoveryProvider } from "@/contexts/ErrorRecoveryContext"
import { useErrorRecoveryContext } from "@/contexts/useErrorRecoveryContext"
import { getUserProfile, loadProgress } from "@/lib/db"
import {
  getLocalXP,
  getLocalGems,
  saveLocalXP,
  saveLocalGems,
  XP_UPDATE_EVENT,
  GEMS_UPDATE_EVENT,
} from "@/lib/xp"
import { syncModuleProgressFromServer } from "@/lib/moduleProgress"

// Initialize user-scoped localStorage namespacing
initUserScope()

const Hero = lazy(() => import("@/pages/Hero"))
const Login = lazy(() => import("@/pages/Login"))
const Signup = lazy(() => import("@/pages/Signup"))
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"))
const AuthCallback = lazy(() => import("@/pages/AuthCallback"))
const ResetPassword = lazy(() => import("@/pages/ResetPassword"))
const Home = lazy(() => import("@/pages/Home"))
const Profile = lazy(() => import("@/pages/Profile"))
const AvatarScreen = lazy(() => import("@/pages/AvatarScreen"))
const LearningLab = lazy(() => import("@/pages/LearningLab"))
const Lesson = lazy(() => import("@/pages/Lesson"))
const SkillDetail = lazy(() => import("@/pages/SkillDetail"))
const MissionComplete = lazy(() => import("@/pages/MissionComplete"))
// DailyMissions removed — /missions is the canonical page
const Favorites = lazy(() => import("@/pages/Favorites"))
const Notifications = lazy(() => import("@/pages/Notifications"))
const Premium = lazy(() => import("@/pages/Premium"))
const Achievements = lazy(() => import("@/pages/Achievements"))
const Prompts = lazy(() => import("@/pages/Prompts"))
const PromptChallenge = lazy(() => import("@/pages/PromptChallenge"))
const Subscription = lazy(() => import("@/pages/Subscription"))
const SkillCategoryPage = lazy(() => import("@/pages/SkillCategoryPage"))
const PromptCategoryPage = lazy(() => import("@/pages/PromptCategoryPage"))
const LevelUp = lazy(() => import("@/pages/LevelUp"))
const News = lazy(() => import("@/pages/News"))
const QuickQuiz = lazy(() => import("@/pages/QuickQuiz"))
const Inventory = lazy(() => import("@/pages/Inventory"))
const Store = lazy(() => import("@/pages/Store"))
const Ranking = lazy(() => import("@/pages/Ranking"))
const PromptDetail = lazy(() => import("@/pages/PromptDetail"))
const TemplateDetail = lazy(() => import("@/pages/TemplateDetail"))
const Templates = lazy(() => import("@/pages/Templates"))
const LabResult = lazy(() => import("@/pages/LabResult"))
const QuizResult = lazy(() => import("@/pages/QuizResult"))
const Certificates = lazy(() => import("@/pages/Certificates"))
const Certificate = lazy(() => import("@/pages/Certificate"))
const Onboarding = lazy(() => import("@/pages/Onboarding"))
const PromptLab = lazy(() => import("@/pages/PromptLab"))
const Lab = lazy(() => import("@/pages/Lab"))
const Missions = lazy(() => import("@/pages/Missions"))
const ModuleExam = lazy(() => import("@/pages/ModuleExam"))
const PromptWars = lazy(() => import("@/pages/PromptWars"))
const PromptAnalyzer = lazy(() => import("@/pages/PromptAnalyzer"))
const PromptEnhancer = lazy(() => import("@/pages/PromptEnhancer"))
const Roadmap = lazy(() => import("@/pages/Roadmap"))
const Settings = lazy(() => import("@/pages/Settings"))
const BackTapConfig = lazy(() => import("@/pages/BackTapConfig"))
const Community = lazy(() => import("@/pages/Community"))
const Verify = lazy(() => import("@/pages/Verify"))
const Terms = lazy(() => import("@/pages/Terms"))
const Privacy = lazy(() => import("@/pages/Privacy"))

// ── Analytics tracker (page views + user identification + UTM capture) ───
function AnalyticsTracker() {
  const location = useLocation()
  const { user } = useAuth()
  // useUTM captures UTM/gclid params on first load and persists to sessionStorage.
  // Subsequent calls from anywhere in the app (e.g. trackSignUp) read from there.
  useUTM()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    pageView(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    if (user) {
      identify(user.id, {
        email: user.email,
        name: user.user_metadata?.full_name,
      })
    } else {
      reset()
    }
  }, [user?.id])

  return null
}

// ── Activity & Reminder Tracker ───────────────────────────────────────────
function ActivityTracker() {
  // Monitors inactivity, records activity, and triggers push notifications
  // when the user hasn't accessed in 12+ hours and hasn't visited today.
  useInactiveReminder()
  return null
}

// ── Mission Tracker ───────────────────────────────────────────────────────
function MissionTracker() {
  const { user } = useAuth()
  useEffect(() => {
    if (user?.id) completeMission("visit")
  }, [user?.id])
  return null
}

// ── Profile Sync: DB → localStorage on login ─────────────────────────────
// Ensures XP, gems and category progress are visible even on a fresh device.
function ProfileSyncTracker() {
  const { user } = useAuth()
  useEffect(() => {
    if (!user?.id) return
    const uid = user.id

    // Sync XP / gems from DB if localStorage is empty
    const localXP = getLocalXP(uid)
    const localGems = getLocalGems(uid)
    if (localXP === 0 || localGems === 0) {
      getUserProfile(uid).then(({ data: profile }) => {
        if (!profile) return
        if (localXP === 0 && (profile.xp ?? 0) > 0) {
          saveLocalXP(uid, profile.xp!)
          window.dispatchEvent(new Event(XP_UPDATE_EVENT))
        }
        if (localGems === 0 && (profile.gems ?? 0) > 0) {
          saveLocalGems(uid, profile.gems!)
          window.dispatchEvent(new Event(GEMS_UPDATE_EVENT))
        }
      })
    }

    // Sync category progress from DB → localStorage (loadProgress already does this)
    loadProgress(uid).catch(() => {
      /* silent — localStorage remains as fallback */
    })

    // Sync Trilha (module) progress from DB → localStorage, merging the higher count
    syncModuleProgressFromServer(uid).catch(() => {
      /* silent — localStorage remains as fallback */
    })
  }, [user?.id])
  return null
}

// ── Global offline/error recovery banner ──────────────────────────────────
function OfflineIndicator() {
  const ctx = useErrorRecoveryContext()
  if (!ctx) return null
  const { errors, isOnline, removeError, executeRecovery } = ctx
  return (
    <ErrorRecoveryPanel
      errors={errors}
      isOnline={isOnline}
      onRemoveError={removeError}
      onExecuteRecovery={executeRecovery}
    />
  )
}

// ── Welcome Back: greets users who were away for 2+ days ─────────────────
function WelcomeBackTracker() {
  const { user } = useAuth()
  const { initialLoading, checkDailyVisit } = useAchievements()
  const [daysAbsent, setDaysAbsent] = useState<number | null>(null)
  const checkedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!user?.id || initialLoading) return
    if (checkedUserIdRef.current === user.id) return
    checkedUserIdRef.current = user.id

    checkDailyVisit(user.id).then(({ daysAbsent: absent }) => {
      if (absent !== null && absent >= 2) setDaysAbsent(absent)
    })
  }, [user?.id, initialLoading, checkDailyVisit])

  if (daysAbsent === null) return null

  return (
    <WelcomeBackScreen
      active
      name={user?.user_metadata?.full_name?.split(" ")[0]}
      onClose={() => setDaysAbsent(null)}
    />
  )
}

export default function App() {
  return (
    <ErrorRecoveryProvider>
      <ThemeProvider>
        <AuthProvider>
          <AvatarProvider>
            <PremiumProvider>
              <LivesProvider>
                <AchievementsProvider>
                  <AnalyticsTracker />
                  <ActivityTracker />
                  <MissionTracker />
                  <ProfileSyncTracker />
                  <WelcomeBackTracker />
                  <OfflineIndicator />
                  <Toaster position="top-right" />
                  <QuickEnhanceModal />
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route path="/" element={<Hero />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      {/* ── Authenticated app routes — wrapped with desktop sidebar layout ── */}
                      <Route
                        path="/profile"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Profile />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/avatars"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <AvatarScreen />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/home"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Home />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/learn"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <LearningLab />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/lesson"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Lesson />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route path="/skills" element={<Navigate to="/lab" replace />} />
                      <Route
                        path="/skill/:skillName"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <SkillDetail />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/mission"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <MissionComplete />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route path="/daily-missions" element={<Navigate to="/missions" replace />} />
                      <Route
                        path="/favorites"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Favorites />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Notifications />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/premium"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Premium />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/achievements"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Achievements />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/prompts"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Prompts />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/challenge"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <PromptChallenge />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/subscription"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Subscription />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/learn/category/:categoryId"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <SkillCategoryPage />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/prompts/category/:categoryId"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <PromptCategoryPage />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/level-up"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <LevelUp />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/news"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <News />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/quiz"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <QuickQuiz />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/inventory"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Inventory />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/store"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Store />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/ranking"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Ranking />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/quiz-result"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <QuizResult />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/certificates"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Certificates />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/certificate"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Certificate />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/prompt/:promptId"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <PromptDetail />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/templates"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Templates />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/template/:templateId"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <TemplateDetail />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/lab-result"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <LabResult />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/onboarding"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Onboarding />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route
                        path="/lab"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Lab />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/prompt-lab"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <PromptLab />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/missions"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Missions />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/module-exam"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <ModuleExam />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/prompt-wars"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <PromptWars />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/prompt-analyzer"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <PromptAnalyzer />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/prompt-enhancer"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <PromptEnhancer />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/roadmap"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Roadmap />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Settings />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/settings/back-tap"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <BackTapConfig />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/community"
                        element={
                          <PrivateRoute>
                            <AppLayout>
                              <Community />
                            </AppLayout>
                          </PrivateRoute>
                        }
                      />
                      <Route path="/verify/:id" element={<Verify />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </AchievementsProvider>
              </LivesProvider>
            </PremiumProvider>
          </AvatarProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorRecoveryProvider>
  )
}
