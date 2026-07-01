<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})
import { z } from 'zod'
import type { Usuario } from '~/types/usuario';

const schemaNuevoUsuario = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Debe ser un correo válido (usuario@dominio.com)'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

const {data: usuarios, pending, error, refresh} = await useFetch<Usuario[]>('/api/Usuario')

const rol = ['Staff']
const mostrarFormulario = ref(false)
const errorFormulario = ref('')
const guardandoUsuario = ref(false)

const formularioUsuario = reactive({
    nombre: '',
    apellido: '',
    password: '',
    rol: rol[0],
    email: ''
})

function reseteoFormulario(){
    formularioUsuario.nombre = ''
    formularioUsuario.apellido = ''
    formularioUsuario.rol = rol[0]
    formularioUsuario.email = ''
    formularioUsuario.password = ''
    errorFormulario.value = ''
}

function cerrarFormulario () {
    mostrarFormulario.value = false
    errorFormulario.value = ''
    reseteoFormulario()
}

async function guardarUsuarioNuevo(){
    guardandoUsuario.value = true
    try{
        await $fetch('/api/Usuario', {
            method: 'POST',
            body: {
                email: formularioUsuario.email,
                password: formularioUsuario.password,
                nombre: formularioUsuario.nombre,
                apellido: formularioUsuario.apellido,
                rol: formularioUsuario.rol
            }
        })
        cerrarFormulario()
        await refresh()
    }
    catch (err: any){
        errorFormulario.value = getApiErrorMessage(err, "No se ha guardado el nuevo usuario")
    }
    finally {
        guardandoUsuario.value = false
    }
}

const mostrarBorrar = ref(false)
const borrandoUsuario = ref(false)
const deleteUsuario = ref<Usuario | null>(null)

async function borrarUsuario() {
    borrandoUsuario.value = true
    try{
        await $fetch(`/api/Usuario/${deleteUsuario.value?.email}`, {
            method: 'DELETE'
        })
        cerrarConfirFormulario()
        await refresh()
    } catch(err: any){        
    } finally {
        borrandoUsuario.value = false
    }
}

function confirmarBorrar(usuario: Usuario){
    deleteUsuario.value = usuario
    mostrarBorrar.value = true
}

function cerrarConfirFormulario(){
    mostrarBorrar.value = false
    deleteUsuario.value = null
    reseteoFormulario()
}
</script>

<template>
    <div class="space-y-8">
        <section class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-brand-red sm:text-4xl">
                    Usuarios Staff
                </h1>
                <p class="mt-3 max-w-2xl text-base leading-7 text-brand-muted">
                    Visualice y administre las cuentas de acceso del staff.
                </p>
            </div>
            <UButton @click="mostrarFormulario = true" class="bg-brand-red text-white hover:bg-brand-red/80">
                Agregar Usuario
            </UButton>
        </section>

        <section class="grid gap-4 md:grid-cols-2">
            <div v-for="usuario in usuarios" key="usuarios" class="bg-brand-surface border border-brand-border rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                    <p class="font-medium text-brand-text">{{ usuario.nombre }} {{ usuario.apellido }}</p>
                    <p class="text-sm text-brand-muted">{{ usuario.email }}</p>
                    <p class="text-sm text-brand-muted">Rol: {{ usuario.rol }}</p>
                </div>
                <UButton color="neutral" variant="subtle" @click="confirmarBorrar(usuario)">
                    Borrar
                </UButton>
            </div>
        </section>
    </div>

    <UModal v-model:open="mostrarFormulario">
        <template #content>
            <div class="p-6 bg-brand-surface">
                <h2 class="text-lg font-medium text-brand-text mb-1">Agregar Usuario</h2>
                <p class="text-sm text-brand-muted mb-4">Completa los datos para registrar un nuevo miembro del staff.</p>
                <UForm :schema="schemaNuevoUsuario" :state="formularioUsuario" class="space-y-4" @submit="guardarUsuarioNuevo">
                    <UFormField label="Nombre" name="nombre">
                        <UInput v-model="formularioUsuario.nombre" class="w-full" placeholder="Ejemplo: Carlos" />
                    </UFormField>

                    <UFormField label="Apellido" name="apellido">
                        <UInput v-model="formularioUsuario.apellido" class="w-full" placeholder="Ejemplo: Alten" />
                    </UFormField>

                    <UFormField label="Email" name="email">
                        <UInput v-model="formularioUsuario.email" class="w-full" placeholder="Ej: usuario@smartevents.cl" />
                    </UFormField>

                    <UFormField label="Contraseña" name="password">
                        <UInput type="password" v-model="formularioUsuario.password" class="w-full" placeholder="Al menos 6 caracteres" />
                    </UFormField>

                    <UAlert v-if="errorFormulario" color="error" variant="soft" :title="errorFormulario" />

                    <div class="flex justify-end gap-3 pt-2">
                        <UButton type="button" color="neutral" variant="subtle" @click="cerrarFormulario">
                            Cancelar
                        </UButton>
                        <UButton type="submit" :loading="guardandoUsuario" class="bg-brand-red text-white hover:bg-brand-red/80">
                            Agregar Usuario
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>

    <UModal v-model:open="mostrarBorrar">
        <template #body>
            <div class="p-6 bg-brand-surface">
                <h2 class="text-lg font-medium text-brand-text mb-1">Borrar usuario</h2>
                <p class="text-sm text-brand-muted mb-4">
                    {{ deleteUsuario ? `¿Estás seguro que deseas borrar a ${deleteUsuario.nombre}? Esta acción no se puede deshacer.` : '' }}
                </p>
                <div class="flex justify-end gap-3 pt-2">
                    <UButton type="button" color="neutral" variant="subtle" @click="cerrarConfirFormulario">
                        Cancelar
                    </UButton>
                    <UButton type="button" :loading="borrandoUsuario" class="bg-brand-red text-white hover:bg-brand-red/80" @click="borrarUsuario">
                        Borrar Usuario
                    </UButton>
                </div>
            </div>
        </template>
    </UModal>
</template>