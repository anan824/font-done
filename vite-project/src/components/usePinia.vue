<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const changeName = ()=>{
    userStore.updateName('李四')
}
</script> 
<template>
    <div>{{ userStore.name }}</div>
    <div @click="changeName">change Name</div>
</template>
  
  