<template>
    <div>
        <button
            type="button"
            class="btn btn-secondary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-login"
            v-if="token == null"
        >
            Sign In
        </button>
        <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click="onClickLogout"
            v-if="token != null"
        >
            Sign Out
        </button>

        <div id="modal-login" class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button
                            type="button"
                            class="btn btn-close btn-sm"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <form
                            @submit.prevent="onSubmitLogin"
                            v-if="token == null"
                        >
                            <div class="mb-3">
                                <label for="username" class="col-form-label"
                                    >Username</label
                                >
                                <input
                                    type="text"
                                    class="form-control form-control-sm"
                                    id="username"
                                    v-model="username"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="col-form-label"
                                    >Password</label
                                >
                                <input
                                    type="password"
                                    class="form-control form-control-sm"
                                    id="password"
                                    v-model="password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                class="btn btn-primary btn-sm"
                            >
                                Sign in
                            </button>
                            <div
                                class="alert alert-danger mt-3"
                                role="alert"
                                v-show="message"
                                v-text="message"
                            ></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import { Modal } from 'bootstrap';
import { PROTO, API_HOST } from '../storage/service';

export default {
    name: 'LoginModal',
    data() {
        return {
            token: localStorage.getItem('user-token') || null,
            username: '',
            password: '',
            message: '',
        };
    },
    methods: {
        onSubmitLogin() {
            axios
                .post(`${PROTO}://${API_HOST}/auth/`, {
                    username: this.username,
                    password: this.password,
                })
                .then((resp) => {
                    this.token = resp.data.token;
                    localStorage.setItem('user-token', this.token);
                    Modal.getInstance(
                        document.getElementById('modal-login'),
                    ).hide();
                    this.resetForm();
                    this.$router.go();
                })
                .catch(() => {
                    localStorage.removeItem('user-token');
                    this.message = 'Wrong username or password';
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
        },
    },
};
</script>
