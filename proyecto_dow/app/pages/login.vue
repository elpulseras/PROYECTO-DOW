<script setup lang="ts">
import { z } from 'zod'

const schemaLogin = z.object({
    email: z.string()
        .email('Debe ser un correo válido (usuario@dominio.com)'),
    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

const iniciandoSesion = ref(false)
const errorForm = ref('')
const formLogin = reactive({
    email: '',
    password: ''
})

const { fetch: fetchSession } = useUserSession()

async function login() {
    iniciandoSesion.value = true
    errorForm.value = ''

    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email: formLogin.email,
                password: formLogin.password
            }
        })
        await fetchSession()
        await navigateTo('/usuarios')
    }
    catch (err: any) {
        errorForm.value = getApiErrorMessage(err, 'No se pudo iniciar sesión')
    }
    finally {
        iniciandoSesion.value = false
    }
}
</script>

<template>
    <div class="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8
        bg-[radial-gradient(circle_at_top,rgba(230,57,70,0.12),transparent_28%),radial-gradient(circle_at_right_20%,rgba(255,45,85,0.08),transparent_24%)]">

        <UCard class="w-full max-w-md border border-brand-border bg-brand-surface shadow-xl shadow-brand-red/10">
            <template #header>
                <div class="space-y-3 text-center">
                    <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-red-soft">
                        Panel de Administración
                    </p>
                    <p class="text-2xl font-bold text-brand-text">
                        <span class="text-brand-red">Smart</span> Events
                    </p>
                    <p class="text-sm text-brand-muted">
                        Ingresa tus credenciales para acceder al panel de staff.
                    </p>
                </div>
            </template>

            <div>
                <UForm :schema="schemaLogin" :state="formLogin" class="space-y-5" @submit="login">
                    <UFormField label="Correo electrónico" name="email">
                        <UInput v-model="formLogin.email" placeholder="correo@smartevents.cl" size="xl" class="w-full" />
                    </UFormField>

                    <UFormField label="Contraseña" name="password">
                        <UInput v-model="formLogin.password" placeholder="Ingresa tu contraseña" type="password" size="xl" class="w-full" />
                    </UFormField>

                    <UAlert v-if="errorForm" color="error" variant="soft" :title="errorForm" />

                    <UButton type="submit" :loading="iniciandoSesion" block size="xl" class="bg-brand-red text-brand-text hover:bg-brand-red/80">
                        Ingresar al Panel
                    </UButton>
                </UForm>
            </div>

            <template #footer>
                <div class="text-center">
                    <NuxtLink to="/" class="text-sm text-brand-muted hover:text-brand-text transition-colors">
                        Volver a la página principal
                    </NuxtLink>
                </div>
            </template>
        </UCard>
    </div>
</template>