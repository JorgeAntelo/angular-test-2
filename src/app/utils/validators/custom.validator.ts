import { AbstractControl } from '@angular/forms';
export function passwordValidator(control: AbstractControl) {
  const password = control.value;
  if (!password) {
    return null;
  }
  if (password != 'pass') {
    return { validPassword: false };
  }

  return null;
}
