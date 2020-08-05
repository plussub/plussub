import { onUnmounted, onMounted, Ref } from 'vue';

const getShadowDiv = (): HTMLElement => {
  const shadowDiv = document.querySelector('#plussubShadow');
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
    document.removeEventListener('mouseUp', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
  };

  const elementDrag = (e: MouseEvent) => {
    e.preventDefault();
    // calculate the new cursor position:
    position = {
      x: {
        current: position.x.last - e.clientX,
        last: e.clientX
      },
      y: {
        current: position.y.last - e.clientY,
        last: e.clientY
      }
    };
    appShadowDiv.style.top = `${appShadowDiv.offsetTop - position.y.current}px`;
    appShadowDiv.style.left = `${appShadowDiv.offsetLeft - position.x.current}px`;
  };

  const dragMouseDown = (e) => {
    e.preventDefault();
    // get the mouse cursor position at startup:
    position.x.last = e.clientX;
    position.y.last = e.clientY;
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('mousemove', elementDrag);
  };

  onMounted(() => {
    const appShadowDiv = getShadowDiv();
    if (!appShadowDiv.shadowRoot) {
      return;
    }
    if(draggableAreaRef.value.$el){
      draggableAreaRef.value.$el.addEventListener('mousedown', dragMouseDown);
    } else {
      draggableAreaRef.value.addEventListener('mousedown', dragMouseDown);
    }
  });
  onUnmounted(() => {
    if(draggableAreaRef.value.$el){
      draggableAreaRef.value.$el.removeEventListener('mousedown', dragMouseDown);
    } else {
      draggableAreaRef.value.removeEventListener('mousedown', dragMouseDown);
    }
  });
};
