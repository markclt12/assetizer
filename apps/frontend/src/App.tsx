import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { LoadingState } from "./components/States";
import { PublicLayout } from "./layouts/PublicLayout";
import { AREA_LIST } from "./lib/catalog";
import { AreaHubPage } from "./pages/AreaHubPage";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { LandingPage } from "./pages/LandingPage";
import { LessonPage } from "./pages/LessonPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { QuizPage } from "./pages/QuizPage";
import { TopicListPage } from "./pages/TopicListPage";

// Admin screens are split out of the learner bundle.
const named = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) =>
  lazy(() => load().then((module) => ({ default: module[name] })));

const AdminLayout = named(() => import("./layouts/AdminLayout"), "AdminLayout");
const LoginPage = named(() => import("./pages/admin/LoginPage"), "LoginPage");
const DashboardPage = named(() => import("./pages/admin/DashboardPage"), "DashboardPage");
const CategoryEditorPage = named(() => import("./pages/admin/CategoryEditorPage"), "CategoryEditorPage");
const TopicEditorPage = named(() => import("./pages/admin/TopicEditorPage"), "TopicEditorPage");
const LessonEditorPage = named(() => import("./pages/admin/LessonEditorPage"), "LessonEditorPage");
const ActivityEditorPage = named(() => import("./pages/admin/ActivityEditorPage"), "ActivityEditorPage");
const CaseStudyEditorPage = named(() => import("./pages/admin/CaseStudyEditorPage"), "CaseStudyEditorPage");

const TOPIC_PAGES = {
  "main-course": LessonPage,
  "practice-bites": QuizPage,
  specials: CaseStudyPage,
} as const;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          {AREA_LIST.map((area) => {
            const TopicPage = TOPIC_PAGES[area.key];
            return (
              <Route key={area.key} path={area.key}>
                <Route index element={<AreaHubPage areaKey={area.key} />} />
                <Route path=":category" element={<TopicListPage key={area.key} areaKey={area.key} />} />
                <Route path=":category/:topic" element={<TopicPage />} />
              </Route>
            );
          })}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="admin/login" element={<LoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories/:id" element={<CategoryEditorPage />} />
          <Route path="topics/:id" element={<TopicEditorPage />} />
          <Route path="lessons/:id" element={<LessonEditorPage />} />
          <Route path="activities/:id" element={<ActivityEditorPage />} />
          <Route path="case-studies/:id" element={<CaseStudyEditorPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
