<template>
    <div>
        <b-button size="sm" @click="$bvModal.show('modal-login')" v-if="token == null">Sign In</b-button>
        <b-button size="sm" @click="onClickLogout" v-if="token != null">Sign Out</b-button>

        <b-modal id="modal-login" hide-footer>
            <div class="d-block text-center">
                <b-form @submit.prevent="onSubmitLogin" v-if="token == null">
                    <b-form-group label="Username" label-for="username">
                        <b-form-input id="username" v-model="username" required autofocus></b-form-input>
                    </b-form-group>
                    <b-form-group label="Password" label-for="password">
                        <b-form-input id="password" v-model="password" type="password" required></b-form-input>
                    </b-form-group>
                    <b-button type="submit" variant="primary">Sign in</b-button>
                </b-form>
                <b-button type="submit" @click="onClickLogout" v-if="token != null">Sign Out</b-button>
                <br/><br/>
                <b-alert
                    variant="danger"
                    v-show="message"
                    v-text="message"
                    dismissible
                    :show="dismiss_countdown"
                    @dismissed="dismiss_countdown=0"
                >
                </b-alert>
            </div>
        </b-modal>
    </div>
</template>

<script>
import axios from 'axios';
import {API_HOST} from '../storage/service'

export default {
    name: 'Login',
    data() {
        return {
            token: localStorage.getItem('user-token') || null,
            username: '',
            password: '',
            message: '',
            dismiss_secs: 5,
            dismiss_countdown: 0
        }
    },
    methods: {
        onSubmitLogin() {
            axios.post(`http://${API_HOST}/auth/`, {
                username: this.username,
                password: this.password
            })
            .then(resp => {
                this.token = resp.data.token;
                localStorage.setItem('user-token', this.token);
                this.$bvModal.hide('modal-login');
                this.resetForm();
                this.$router.go();
            })
            .catch(err => {
                localStorage.removeItem('user-token');
                this.message = 'Wrong username or password';
                this.dismiss_countdown = this.dismiss_secs;
            });
        },
        onClickLogout() {
            localStorage.removeItem('user-token');
            this.token = null;
            this.resetForm();
            this.$router.go();
        },
        resetForm() {
            this.username = '';
            this.password = '';
            this.message = '';
        }
    }
}
</script>