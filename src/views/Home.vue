<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore, useUsersStore, useEventsStore, useAlertStore } from '@/stores';

import { Qalendar } from "qalendar";

import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

// import { router } from '@/router';

import moment from 'moment';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const eventsStore = useEventsStore();
const alertStore = useAlertStore();

const currentUser = ref(user);
const isFormShow = ref(false);

const isCalendar = ref(true);


const { event, events } = storeToRefs(eventsStore);


const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);


const refreshEvents = async (isFirst) => {
  await eventsStore.getAll();
  if (isFirst) {
    await usersStore.getAll();
  }
  events.value.forEach(element => {
    element.with = users.value.find(x => x.id === element.with).name 
  });
}

const btnText = ref('');


const config = {
  defaultMode: "month",
  style: {
    colorSchemes: {
      meetings: {
        color: "#fff",
        backgroundColor: "#ff4081",
      },
      sports: {
        color: "#fff",
        backgroundColor: "#131313",
      },
    },
  },
};

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Username is required'),
  date_call: Yup.date()
    .required('Called Date is required'),
  date_waterlogging: Yup.date()
    .required('Hardening Date is required'),
  time_start: Yup.string(),
    // .required('Started Time is required'),
  time_end: Yup.string()
    .test("is-greater", "Ended Time should be greater than Started Time", function(value) {
      const { time_start } = this.parent;
      return moment(value, "HH:mm").isSameOrAfter(moment(time_start, "HH:mm"));
    }),
    // .required('Ended Time is required'),
  time_estimate: Yup.string(),
    // .required('Estimate Time is required'),
  acre: Yup.string()
    .required('ACRE is required'),
  valve_number: Yup.number()
    .required('Valve Number is required'),
  due_price: Yup.number()
    .required('Role is required'),
});

const onSubmit = async (values) => {   
  try {
    let message;
    values.created_by_id = currentUser.value.id;
    // console.log(values);
    // console.log(event.value);
    if (event.value) {
      await eventsStore.update(event.value.id, values);
      message = 'Event updated';
    } else {      
      await eventsStore.create(values);
      message = 'Event added';
    }
    alertStore.success(message);
    refreshEvents(false);
    isFormShow.value = false;
  } catch (error) { 
      alertStore.error(error);
  }
};

const handleAdd = () => {
  // console.log("ADD EVENT!")
  btnText.value = 'Create'
  event.value = null;
  isFormShow.value = true
};

const editEvent = (id) => {
  if (!user.value.is_admin) {
    return;
  }
  // console.log("EDIT EVENT!")
  // console.log(id)
  eventsStore.getById(id);
  // console.log(event);

  btnText.value = 'Edit'
  isFormShow.value = true
};

const deleteEvent = async (id) => {
  if (!user.value.is_admin) {
    return;
  }
  // console.log("DELETE EVENT!")
  // console.log(id)
  await eventsStore.delete(id)
  alertStore.success('Event deleted');
  await eventsStore.getAll();
};

const reactToEvent = (e) => {
  console.log("REACT EVENT!")
  console.log(e)
};

onMounted(() => {
  refreshEvents(true)
})

</script>

<template>
  <v-layout v-if="user" style="text-align: right;display: block;">
    <button :disabled="!user.is_admin" @click="handleAdd" class="btn btn-success">Add</button>    
    <Qalendar v-if="isCalendar"
      :selected-date="new Date()"
      :events="events.length?events:[]"
      :config="config"
      @edit-event="editEvent"
      @delete-event="deleteEvent"
      @day-was-clicked="reactToEvent"
    >
    </Qalendar>
    <table v-else class="table table-striped">
      <thead>
          <tr>
              <th style="width: 30%">Name</th>
              <th style="width: 30%">Date Called</th>
              <th style="width: 30%">Hardening Date</th>
              <th style="width: 30%">ACRE</th>
              <th style="width: 30%">Value Number</th>
              <th style="width: 30%">Estimate Time</th>
              <th style="width: 30%">Started Time</th>
              <th style="width: 30%">Ended Time</th>
              <th style="width: 30%">Due Price</th>
              <th style="width: 30%">Created by</th>
              <th style="width: 10%"></th>
          </tr>
      </thead>
      <tbody>
          <template v-if="events.length">
              <tr v-for="event in events" :key="event.id">
                  <td>{{ event.name }}</td>
                  <td>{{ event.date_call }}</td>
                  <td>{{ event.date_waterlogging }}</td>
                  <td>{{ event.acre }}</td>
                  <td>{{ event.valve_number }}</td>
                  <td>{{ event.time_estimate }}</td>
                  <td>{{ event.time_start }}</td>
                  <td>{{ event.time_end }}</td>
                  <td>{{ event.due_price }}</td>
                  <td>{{ event.with }}</td>
                  <td style="white-space: nowrap">
                    <button :disabled="!user.is_admin" @click="editEvent(event.id)" class="btn btn-sm btn-primary mr-1">
                      Edit
                    </button>
                    <button @click="deleteEvent(event.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="!user.is_admin || event.isDeleting">
                        <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                        <span v-else>Delete</span>
                    </button>
                  </td>
              </tr>
          </template>
          <tr v-if="events.loading">
              <td colspan="4" class="text-center">
                  <span class="spinner-border spinner-border-lg align-center"></span>
              </td>
          </tr>
          <tr v-if="events.error">
              <td colspan="4">
                  <div class="text-danger">Error loading users: {{events.error}}</div>
              </td>
          </tr>            
      </tbody>
    </table>
    <v-dialog v-model="isFormShow" justify="center" width="30%">
      <v-card style="padding: 30px;" v-if="!(event?.loading || event?.error)">
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="event" v-slot="{ errors, isSubmitting }">
          <div class="form-group">
            <label>Schedule Name</label>
            <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" />
            <div class="invalid-feedback">{{ errors.name }}</div>
          </div>
          <div class="form-group">
              <label>Date Called</label>
              <Field name="date_call" type="date" class="form-control" :class="{ 'is-invalid': errors.date_call }" />
              <div class="invalid-feedback">{{ errors.date_call }}</div>
          </div>
          <div class="form-group">
              <label>Harding Datetime</label>
              <Field name="date_waterlogging" type="datetime-local" class="form-control" :class="{ 'is-invalid': errors.date_waterlogging }" />
              <div class="invalid-feedback">{{ errors.date_waterlogging }}</div>
          </div>
          <div class="form-group">
              <label>Estimated Time</label>
              <Field name="time_estimate" type="time" class="form-control" :class="{ 'is-invalid': errors.time_estimate }" />
              <div class="invalid-feedback">{{ errors.time_estimate }}</div>
          </div>
          <div class="form-group">
              <label>Started Time</label>
              <Field name="time_start" type="time" class="form-control" :class="{ 'is-invalid': errors.time_start }" />
              <div class="invalid-feedback">{{ errors.time_start }}</div>
          </div>
          <div class="form-group">
              <label>Ended time</label>
              <Field name="time_end" type="time" class="form-control" :class="{ 'is-invalid': errors.time_end }" />
              <div class="invalid-feedback">{{ errors.time_end }}</div>
          </div>
          <div class="form-group">
            <label>ACRE</label>
            <Field name="acre" type="text" class="form-control" :class="{ 'is-invalid': errors.acre }" />
            <div class="invalid-feedback">{{ errors.acre }}</div>
          </div>
          <div class="form-group">
            <label>Valve Number</label>
            <Field name="valve_number" type="text" class="form-control" :class="{ 'is-invalid': errors.valve_number }" />
            <div class="invalid-feedback">{{ errors.valve_number }}</div>
          </div>
          <div class="form-group">
            <label>Due Price</label>
            <Field name="due_price" type="text" class="form-control" :class="{ 'is-invalid': errors.due_price }" />
            <div class="invalid-feedback">{{ errors.due_price }}</div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary" :disabled="isSubmitting" style="margin-right: 20px;">
                <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                {{ btnText }}
            </button>
            <v-btn @click="isFormShow=false">Cancel</v-btn>
          </div>
        </Form>
      </v-card>
      <template v-if="event?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
      </template>
      <template v-if="event?.error">
        <div class="text-center m-5">
            <div class="text-danger">Error loading event: {{user.error}}</div>
        </div>
      </template>
    </v-dialog>    
  </v-layout>
  <v-bottom-navigation theme="dark" :elevation="13" grow>
    <v-btn value="favorites" @click="isCalendar=true">
      <v-icon>mdi-calendar</v-icon>      
      Calendar View
    </v-btn>
  
    <v-btn value="nearby" @click="isCalendar=false">
      <v-icon>mdi-view-list</v-icon>
      List View
    </v-btn>
    <!-- <v-btn value="recent" @click="router.push('/users')">
      <v-icon>mdi-history</v-icon>      
      Manage Users
    </v-btn> -->
  </v-bottom-navigation>
</template>

<style>
    /** Please observe,
    that your path to the node_modules directory might be different */
    @import '../../node_modules/qalendar/dist/style.css';
</style>
