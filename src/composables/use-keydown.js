import { onBeforeUnmount } from '@vue/runtime-core';

const useKeydown = (keyCombos) => {
  const onKeydown = evt => {
    console.log(evt.key);
    const kc = keyCombos.find(kc => kc.key === evt.key)
    if (kc) {
      kc.fn()
    }
  }
  window.addEventListener('keydown', onKeydown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
  })
}

export default useKeydown;
