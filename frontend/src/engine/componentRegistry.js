import TextInput from '../components/dynamic/fields/TextInput';
import TextareaInput from '../components/dynamic/fields/TextareaInput';
import NumberInput from '../components/dynamic/fields/NumberInput';
import SelectInput from '../components/dynamic/fields/SelectInput';
import CheckboxInput from '../components/dynamic/fields/CheckboxInput';
// import DateInput from '../components/dynamic/fields/DateInput'; // We'll implement later or use TextInput for now
// import EmailInput from '../components/dynamic/fields/EmailInput'; // Use TextInput with type=email
// import PasswordInput from '../components/dynamic/fields/PasswordInput'; // Use TextInput with type=password
import UnsupportedField from '../components/dynamic/UnsupportedField';
import FallbackRenderer from '../components/dynamic/FallbackRenderer';

const registry = {
  text: TextInput,
  textarea: TextareaInput,
  number: NumberInput,
  select: SelectInput,
  checkbox: CheckboxInput,
  date: TextInput, // Reusing TextInput with HTML5 type=date
  email: TextInput,
  password: TextInput,
  _unsupported: UnsupportedField,
  _fallback: FallbackRenderer,
};

export function getComponent(type) {
  return registry[type] || registry['_unsupported'];
}

export function registerComponent(type, Component) {
  registry[type] = Component;
}
