import { defineStore } from 'pinia'
import api from '@/services/api'

export const useCacheStore = defineStore('cache', {
  state: () => ({
    featuredTutors: null,
    featuredTutorsTimestamp: null,
    
    subjectsAll: null, // Full list of subjects without pagination (for filters)
    
    profiles: {}, // Cache individual profiles by ID
    
    // Config: 5 minutes cache expiration
    CACHE_DURATION: 5 * 60 * 1000, 
  }),
  
  actions: {
    // Check if cache is still valid
    isCacheValid(timestamp) {
      if (!timestamp) return false;
      return (Date.now() - timestamp) < this.CACHE_DURATION;
    },

    async getFeaturedTutors(forceRefresh = false) {
      if (!forceRefresh && this.featuredTutors && this.isCacheValid(this.featuredTutorsTimestamp)) {
        return this.featuredTutors;
      }
      
      try {
        const response = await api.get('/tutors/featured');
        this.featuredTutors = response.data.data || response.data;
        this.featuredTutorsTimestamp = Date.now();
        return this.featuredTutors;
      } catch (error) {
        console.error('Failed to fetch featured tutors:', error);
        throw error;
      }
    },

    async getSubjectsAll(forceRefresh = false) {
      if (!forceRefresh && this.subjectsAll) {
        return this.subjectsAll;
      }
      
      try {
        const response = await api.get('/subjects');
        this.subjectsAll = response.data.data || response.data;
        return this.subjectsAll;
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        throw error;
      }
    },

    async getProfile(id, forceRefresh = false) {
      if (!forceRefresh && this.profiles[id]) {
        return this.profiles[id];
      }
      
      try {
        const response = await api.get(`/users/${id}/profile`);
        this.profiles[id] = response.data;
        return this.profiles[id];
      } catch (error) {
        console.error(`Failed to fetch profile for user ${id}:`, error);
        throw error;
      }
    },

    clearCache() {
      this.featuredTutors = null;
      this.featuredTutorsTimestamp = null;
      this.subjectsAll = null;
      this.profiles = {};
    }
  }
});
