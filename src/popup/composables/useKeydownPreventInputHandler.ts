import {Ref} from "@vue/reactivity";

interface Payload {
  inputRef: Ref;
  valueRef: Ref;
  allowedInputValue: RegExp;
}

export const useKeydownPreventInputHandler = ({inputRef, valueRef, allowedInputValue}: Payload) => (event) => {
  const {key} = event;
  const startPos = inputRef.value.selectionStart;
  const endPos = inputRef.value.selectionEnd;
  if (key.match(allowedInputValue)) {
    valueRef.value = [valueRef.value.toString().slice(0, startPos), key, valueRef.value.toString().slice(endPos)].join('');
    setTimeout(() => inputRef.value.setSelectionRange(startPos + 1, startPos + 1));
  } else if (key === 'Backspace') {
    valueRef.value = [valueRef.value.toString().slice(0, startPos - 1), valueRef.value.toString().slice(endPos)].join('')
    setTimeout(() => inputRef.value.setSelectionRange(startPos - 1, startPos - 1));
  } else if (key === 'ArrowRight') {
    inputRef.value.setSelectionRange(startPos + 1, startPos + 1);
  } else if (key === 'ArrowLeft') {
    inputRef.value.setSelectionRange(startPos - 1, startPos - 1);
  }
}
