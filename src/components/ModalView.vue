<template>
  <div class="modal">
    <div class="overlay" @click="emit('closeModal')"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
</template>

<script>
  import { onBeforeUnmount } from '@vue/runtime-core';

  export default {
    setup(props, {emit}) {
      const onKeydown = evt => {
        console.log(evt.key);
        if (evt.key === 'Escape') {
          emit('closeModal')
        }
      }
      window.addEventListener('keydown', onKeydown);

      onBeforeUnmount(() => {
        window.removeEventListener('keydown', onKeydown);
      })

      return {
        emit,
      }
    }
  }
</script>

<style scoped>

</style>
