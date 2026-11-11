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

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { useRouter } from 'vue-router';
import { PROTO, API_HOST } from '@/storage/service';

const router = useRouter();
const token = ref<string | null>(localStorage.getItem('user-token'));
const username = ref('');
const password = ref('');
const message = ref('');

function onSubmitLogin() {
    axios
        .post(`${PROTO}://${API_HOST}/auth/`, {
            username: username.value,
            password: password.value,
        })
        .then((resp) => {
            token.value = resp.data.token as string;
            localStorage.setItem('user-token', token.value);
            Modal.getInstance(document.getElementById('modal-login')!)?.hide();
            resetForm();
            router.go(0);
        })
        .catch(() => {
            localStorage.removeItem('user-token');
            message.value = 'Wrong username or password';
        });
}

function onClickLogout() {
    localStorage.removeItem('user-token');
    token.value = null;
    resetForm();
    router.go(0);
}

function resetForm() {
    username.value = '';
    password.value = '';
    message.value = '';
}
</script>
