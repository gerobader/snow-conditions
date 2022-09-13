import React from 'react';

import './TextInput.scss';

type TextInputProps = {
  value: string,
  setValue: (val: string) => void,
  placeholder: string
}

function TextInput({value, setValue, placeholder}: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export default TextInput;
