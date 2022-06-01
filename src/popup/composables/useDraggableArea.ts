import { onUnmounted, onMounted, Ref } from 'vue';
import { EXTENSION_ORIGIN } from '@/types';

const getShadowDiv = (): HTMLElement => {
  const shadowDiv = document.getElementById(`${EXTENSION_ORIGIN}Shadow`);
  if (!shadowDiv) {
    throw new Error('ShadowDiv not found');
  }
  return shadowDiv as HTMLElement;
};

interface Payload {
  draggableAreaRef: Ref;
}

export const useDraggableArea = ({ draggableAreaRef }: Payload): void => {
  let position = {
    x: {
      current: 0,
      last: 0
    },
    y: {
      current: 0,
      last: 0
    }
  };
  const appShadowDiv = getShadowDiv();

  const closeDragElement = () => {
    document.removeEventListener('touchstart', closeDragElement);
    document.removeEventListener('touchmove', elementDragTouch);

    document.removeEventListener('mouseUp', closeDragElement);
    document.removeEventListener('mousemove', elementDragMouse);
  };
  const elementDragMouse = (e: MouseEvent) => {
    e.preventDefault();
    elementDrag(e);
  };

  const elementDragTouch = (e: TouchEvent) => {
    e.preventDefault();
    elementDrag(e.touches[0]);
  };

  const elementDrag = ({ clientX, clientY }: { clientX: number; clientY: number }) => {
    position = {
      x: {
        current: position.x.last - clientX,
        last: clientX
      },
      y: {
        current: position.y.last - clientY,
        last: clientY
      }
    };
    appShadowDiv.style.top = `${appShadowDiv.offsetTop - position.y.current}px`;
    appShadowDiv.style.left = `${appShadowDiv.offsetLeft - position.x.current}px`;
  };

  const dragTouch = (e: TouchEvent) => {
    position.x.last = e.touches[0].clientX;
    position.y.last = e.touches[0].clientY;
    document.addEventListener('touchend', closeDragElement);
    document.addEventListener('touchmove', elementDragTouch, { passive: false });
  };

  const dragMouse = (e: MouseEvent) => {
    position.x.last = e.clientX;
    position.y.last = e.clientY;
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('mousemove', elementDragMouse);
  };

  onMounted(() => {
    const appShadowDiv = getShadowDiv();
    if (!appShadowDiv.shadowRoot) {
      return;
    }
    if (draggableAreaRef.value.$el) {
      draggableAreaRef.value.$el.addEventListener('touchstart', dragTouch, { passive: false });
      draggableAreaRef.value.$el.addEventListener('mousedown', dragMouse, { passive: false });
    } else {
      draggableAreaRef.value.addEventListener('touchstart', dragTouch, { passive: false });
      draggableAreaRef.value.addEventListener('mousedown', dragMouse, { passive: false });
    }
  });
  onUnmounted(() => {
    if (draggableAreaRef.value?.$el) {
      draggableAreaRef.value.$el.removeEventListener('touchstart', dragTouch);
      draggableAreaRef.value.$el.removeEventListener('mousedown', dragMouse);
    } else {
      draggableAreaRef.value?.removeEventListener('touchstart', dragTouch);
      draggableAreaRef.value?.removeEventListener('mousedown', dragMouse);
    }
  });
};
