import { defineStore } from 'pinia';
import { api } from '../services/api';

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null,
    token: null
  }),
  actions: {
    async fetchMe() {
      if (!this.token) return;
      try {
        const res = await api.get('/users/me');
        this.user = res.data;
      } catch (err) {
        console.warn('fetchMe failed', err);
      }
    }
  }
});

