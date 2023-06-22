import { AbstractControl } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

export interface FormlyCfg{
    type : string;
    key: string;
    className?:string;
    props:PropCfg;
    }
    
export interface SelectCfg{
    label:string;
    value:string | number;
}
    
export interface PropCfg{
    label:string;
    required?:boolean;
    options?:SelectCfg[];
}

export interface ele{
    securityType: string;
    Description: string;
    Category: string;
}

export interface BasicFieldConfig {
    type?: any;
    subType?: string;
    label?: string;
    key?: string;
    placeholder?: string;
    className?: string;
    defaultValue?: any;
    description?: string;
    options?: Array<OptionConfig>;
    multiple?: boolean;
    validations?: Array<BasicValidationConfig>;
    fieldArray?: BasicFieldConfig;
    fieldGroup?: Array<BasicFieldConfig>;
    fieldGroupClassName?: string;
    wrappers?: Array<string>;
    [additionalProperties: string]: any;
  }

  interface OptionConfig {
    value: any;
    label: string;
    disabled?: boolean;
    group?: string;
  }
  export interface BasicValidationConfig {
    validator: string;
    value: any;
    message: string;
  }

  export interface FormlyValidationConfig {
    message?: (error: Error, field: FormlyFieldConfig) => string;
    expression?: (c: AbstractControl) => boolean;
  }

  export interface BasicValidationConfig {
    validator: string;
    value: any;
    message: string;
  }