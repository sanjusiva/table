export enum FieldTypes {
    INPUT = "input",
    RADIO = "radio",
    SELECT = "select",
    RANGE = "range",
    DATE = "date",
    TEXTAREA = "textarea",
    CHECKBOX = "checkbox",
    MULTI_CHECKBOX = "multicheckbox",
    REPEAT = "repeat",
    FILE = "file",
  }
  
export const FormlyTypes: string[] = [...Object.values(FieldTypes)];

export enum Validators {
    REQUIRED = "required",
    PATTERN = "pattern",
    MAX = "max",
    MIN = "min",
    MAXLENGTH = "maxLength",
    MINLENGTH = "minLength",
    CONFIRM_PASSWORD = "confirmPass",
  }
