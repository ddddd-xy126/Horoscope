import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import QuestionnaireList from '../pages/QuestionnaireList.vue';
import QuestionnaireDetail from '../pages/QuestionnaireDetail.vue';
import Profile from '../pages/Profile.vue';
import Achievements from '../pages/Achievements.vue';
import Reports from '../pages/Reports.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/questionnaires', name: 'questionnaires', component: QuestionnaireList },
  { path: '/questionnaires/:id', name: 'questionnaireDetail', component: QuestionnaireDetail },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/achievements', name: 'achievements', component: Achievements },
  { path: '/reports', name: 'reports', component: Reports }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

