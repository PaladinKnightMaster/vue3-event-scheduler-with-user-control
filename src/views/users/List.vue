<script setup>
import { storeToRefs } from 'pinia';

import { useAuthStore, useUsersStore } from '@/stores';
import { router } from '@/router';

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

usersStore.getAll();
</script>

<template>
    <h1>Users</h1>
    <button :disabled="!user.is_admin" @click="router.push('/users/add')" class="btn btn-sm btn-success mb-2">Add User</button>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 30%">Username</th>
                <th style="width: 30%">Email</th>
                <th style="width: 30%">Phone</th>
                <th style="width: 30%">Role</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="users.length">
                <tr v-for="e_user in users" :key="e_user.id">
                    <td>{{ e_user.name }}</td>
                    <td>{{ e_user.email }}</td>
                    <td>{{ e_user.phone }}</td>
                    <td>{{ e_user.is_admin ? 'Admin' : 'User' }}</td>
                    <td style="white-space: nowrap">
                        <button :disabled="!user.is_admin" @click="router.push(`/users/edit/${e_user.id}`)" class="btn btn-sm btn-primary mr-1">Edit</button>
                        <button @click="usersStore.delete(e_user.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="!user.is_admin || e_user.isDeleting">
                            <span v-if="e_user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="users.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="users.error">
                <td colspan="4">
                    <div class="text-danger">Error loading users: {{users.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
</template>
