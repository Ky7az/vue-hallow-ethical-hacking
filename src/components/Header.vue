<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="/">Hallow</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <!-- <b-nav-item href="/">Home</b-nav-item> -->
                <b-nav-item to="/soup">Soup</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <!-- <b-nav-form id="form-login" v-on:submit.prevent="login" v-if="token == null">
                    <b-form-input id="username" size="sm" class="mr-sm-2" v-model="username" placeholder="username" name="username"></b-form-input>
                    <b-form-input id="password" size="sm" class="mr-sm-2" v-model="password" placeholder="password" type="password" name="passord"></b-form-input>
                    <b-button size="sm" class="my-2 my-sm-0" type="submit">Login</b-button>
                </b-nav-form> -->
                <!-- <b-button size="sm" class="my-2 my-sm-0" v-on:click="logout" v-if="token != null">Logout</b-button> -->
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import axios from 'axios';

import {API_HOST} from '../storage/service'

export default {
    name: 'Header',
    components: {
    },
    data() {
        return {
            username: null,
            password: null,
            token: localStorage.getItem('user-token') || null
        }
    },
    methods: {
        login() {
            axios.post(`http://${API_HOST}/auth/`, {
                username: this.username,
                password: this.password
            })
            .then(resp => {
                this.token = resp.data.token;
                localStorage.setItem('user-token', this.token);
            })
            .catch(err => {
                localStorage.removeItem('user-token');
            });
        },
        logout() {
            localStorage.removeItem('user-token');
        }
    }
}
</script>

