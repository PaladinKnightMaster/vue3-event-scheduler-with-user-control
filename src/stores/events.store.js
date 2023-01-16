import { defineStore } from 'pinia';

import { fetchWrapper, event2schedule, schedule2event } from '@/helpers';
import { useAuthStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/schedules`;

export const useEventsStore = defineStore({
    id: 'events',
    state: () => ({
        events: {},
        event: {}
    }),
    actions: {
        async create(value) {
          // console.log("event.store-create")
          // console.log(value)
          const schedule = event2schedule(value);
          // console.log(schedule)
          await fetchWrapper.post(`${baseUrl}/create`, schedule);
        },
        async getAll() {
            this.events = { loading: true };
            try {
              // console.log("event.store-getall")
              let schedules = await fetchWrapper.get(baseUrl);
              // console.log(schedules)
              this.events = schedule2event(schedules, true);
              // console.log(this.events)
            } catch (error) {
                this.events = { error };
            }
        },
        async getById(id) {
            this.event = { loading: true };
            try {
              let schedule = await fetchWrapper.get(`${baseUrl}/${id}`);
              this.event = schedule2event(schedule, false);
            } catch (error) {
                this.event = { error };
            }
        },
        async update(id, params) {
          // console.log("event.store-update")
          // console.log(params)
          const schedule = event2schedule(params);
          // console.log(schedule)
          await fetchWrapper.put(`${baseUrl}/${id}`, schedule);
        },
        async delete(id) {
            // add isDeleting prop to user being deleted
            this.events.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove user from list after deleted
            this.events = this.events.filter(x => x.id !== id);

            // auto logout if the logged in user deleted their own record
            // const authStore = useAuthStore();
            // if (id === authStore.user.id) {
            //     authStore.logout();
            // }
        }
    }
});
