<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

import { useUsersStore, useAlertStore } from '@/stores';
import { router } from '@/router';

const user_roles = [
  { value: 0, text: 'User' },
  { value: 1, text: 'Admin' },
]

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Username is required'),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'Email is not valid')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Phone number is not valid")
    .required('Last Name is required'),
  is_admin: Yup.number()
    .required('Role is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

async function onSubmit(values) {
    const usersStore = useUsersStore();
    const alertStore = useAlertStore();
    try {
        await usersStore.register(values);
        await router.push('/account/login');
        alertStore.success('Registration successful');
    } catch (error) { 
        alertStore.error(error);
    }
}
</script>

<template>
    <div class="card m-3">
        <h4 class="card-header">Register</h4>
        <div class="card-body">
            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
              <div class="form-group">
                <label>Username</label>
                <Field name="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" />
                <div class="invalid-feedback">{{ errors.name }}</div>
              </div>
              <div class="form-group">
                  <label>Email</label>
                  <Field name="email" type="text" class="form-control" :class="{ 'is-invalid': errors.email }" />
                  <div class="invalid-feedback">{{ errors.email }}</div>
              </div>
              <div class="form-group">
                  <label>Phone</label>
                  <Field name="phone" type="text" class="form-control" :class="{ 'is-invalid': errors.phone }" />
                  <div class="invalid-feedback">{{ errors.phone }}</div>
              </div>
              <div class="form-group">
                <label>User Role</label>
                <Field name="is_admin" as="select" class="form-control" :class="{ 'is-invalid': errors.is_admin }">
                  <option value="" disabled>Select a User Role</option>
                  <option v-for="role in user_roles" :key="role.value" :value="role.value">{{ role.text }}</option>
                </Field>
                <div class="invalid-feedback">{{ errors.is_admin }}</div>
              </div>
              <div class="form-group">
                <label>Password</label>
                <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                <div class="invalid-feedback">{{ errors.password }}</div>
              </div>
              <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    Register
                </button>
                <router-link to="login" class="btn btn-link">Cancel</router-link>
              </div>
            </Form>
        </div>
    </div>
</template>
