<template>
    <h1>测试 vueUse 的鼠标坐标dff</h1>
    <h3>Mouse: {{ x }} x {{ y }}</h3>
</template>
  
<script>
import { defineComponent } from 'vue';
import { useMouse } from '@vueuse/core';

export default defineComponent({
    name: 'VueUse',
    setup() {
        const { x, y } = useMouse();

        return {
            x,
            y,
        };
    },
}); 
</script> 
  