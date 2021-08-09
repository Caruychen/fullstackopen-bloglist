import React from 'react'
import TextField from '@material-ui/core/TextField'

const FormInput = ({ value, text, type, onChange }) => {
  const handleChange = ({ target }) => onChange(target.value)
  return (
    <div>
      <TextField
        id={text}
        label={text}
        type={type}
        name={text}
        value={value}
        onChange={handleChange} />
    </div>
  )
}

export default FormInput