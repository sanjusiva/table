import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs';
import { FormlyCfg,BasicFieldConfig,FormlyValidationConfig,BasicValidationConfig } from '../model';
import { FormlyTypes,FieldTypes,Validators } from '../constants/formly.constant'
import { TableService } from '../ctable/table.service';

@Injectable({
  providedIn: 'root'
})
export class FormlyService {

  uniqueArr: any[] = [];
  model: any = {};
  public form: FormGroup = this.fb.group({});
  constructor(public http:HttpClient,private fb: FormBuilder,public tservice:TableService) { }
  getFormFieldValues(){
    return this.http.get('http://localhost:8000/FINAL_FORMLY').pipe(map((res:any)=>{
      console.log('res: ',res);
      const mappedRes = this.normalizeFieldType(res);
      console.log("mappedRes: ",mappedRes);
      return mappedRes;
    }))
  }
  getFormfieldbyid(id:any){
    console.log("service id: ",id);
    // return this.http.get(`http://localhost:3000/table/${id}`)
    return this.http.get(`http://localhost:3000/table?id=${id}`)
  }

  postFormValues(data:any){
    console.log("data: ",data)
    return this.http.post(`http://localhost:3000/add`,data);
  }
  putFormValues(id:any,data:any){
    console.log("data: ",data,id)
    return this.http.put(`http://localhost:3000/put?id=${id}`,data);
  }

private normalizeFieldType(config: BasicFieldConfig[]) {
  console.log("normalize: ",config);
  
  return config.map((field: BasicFieldConfig) => {
    let normField: FormlyFieldConfig = {};
    console.log("nf: ",normField);
    let typeExists = true;
    console.log("ele of config: ",field.fieldGroup);
    
    if (field.fieldGroup || field.fieldArray) {
      const { fieldGroup, fieldArray, ...props } = { ...field };
      console.log("inside if: ",normField);
      field.fieldGroup
        ? (normField.fieldGroup = this.normalizeFieldType(field.fieldGroup))
        : (normField.fieldArray = this.normalizeFieldType([{ ...field.fieldArray }])[0]);
      normField = { ...props, ...normField } as FormlyFieldConfig;
    console.log("bnormField: ",normField);
    } else if (field.type && !FormlyTypes.includes(field.type)) {
      this.throwTypeNotFoundError(field);
      typeExists = false;
    } else if (field.type) {
      typeExists = this.checkTypeExists(field.type, field);
      normField = this.modifyType(field) as FormlyFieldConfig;
    }
    normField = typeExists ? (field['template'] ? { ...normField, template: field['template'] } : normField) : {};
    console.log("anormField: ",normField);
    return normField;
  });
}

// Modify range and date type for all views
private modifyType(field: BasicFieldConfig) {
  console.log("bfield: ",field);
  field = this.reConfigureJSON(field);
  console.log("afield: ",field);
  
  return field;
}

// Restructure basic JSON structure to formly JSON config
private reConfigureJSON(field: BasicFieldConfig) {
  const { key, type, defaultValue, className, validations, ...props } = field;
  let additionalProps = { type: props.subType, ...props };
  delete additionalProps.subType;

  // Add validation reference in props property if exists
  if (!!validations) {
    const validationProps = validations.reduce((acc: FormlyValidationConfig, validation: BasicValidationConfig) => {
      return { ...acc, [validation.validator]: validation.value };
    }, {});
    additionalProps = { ...additionalProps, ...validationProps };
    field['validators'] = this.setValidators(validations);
  }

  delete field.validations;
  field = { key, type, defaultValue, className, props: { ...additionalProps }, validators: field['validators'] };
  return field;
}

// Set Validator expressions and messages
private setValidators(validations: Array<BasicValidationConfig>) {
  return validations?.reduce((acc, validation) => {
    return {
      ...acc,
      [validation.validator]: {
        message: (error: Error, field: FormlyFieldConfig) =>
          validation?.message?.replace("$value", field?.formControl?.value),
        expression: (c: AbstractControl) => this.setValidatorExp(validation, c),
      },
    };
  }, {});
}

// Set Validator expression based on validator
private setValidatorExp(validation: BasicValidationConfig, control: AbstractControl) {
  const validationVal = validation.value;
  console.log("validationVal: ",validationVal);
  switch (validation.validator) {
    case Validators.REQUIRED: {
      const condition =
        control.value && typeof control.value === "object" && Object.values(control.value).includes(false)
          ? false
          : control.value;
        console.log("condition: ",condition);
        
      return condition;
    }
    case Validators.PATTERN:
      console.log("vv: ",validationVal);
      console.log("val: ",control?.value)
      console.log("test val: ",new RegExp(validationVal).test(control.value));
      return new RegExp(validationVal).test(control.value);
    case Validators.MAX:
      return control.value <= validationVal;
    case Validators.MIN:
      return control.value >= validationVal;
    case Validators.MAXLENGTH:
      return control.value?.length <= validationVal;
    case Validators.MINLENGTH:
      return control.value?.length >= validationVal;
    case Validators.CONFIRM_PASSWORD:
      return control.value === this.form.controls[validationVal].value;
    default:
      return true;
  }
}

// Check whether type supported by the applied UI library and if not throw error in console
private checkTypeExists(type: string | Type<FieldType>, field?: BasicFieldConfig) {
  let typeExists = true;
  type === FieldTypes.INPUT && field?.['props']?.type ? this.checkTypeExists(field['props'].type) : "";
  console.log("checkTYpe: ",typeExists);
  
  return typeExists;
}
private throwTypeNotFoundError(field: BasicFieldConfig) {
  console.error(
    `The type "${field.type}" could not be found. If ${field.type} is a custom type, please register it in  FormlyFormModule declaration as type and add it's component.
          Example:
            FormlyFormModule.forRoot({
            types: [{ name: "${field.type}", component: ${field.type}Component}]
            })`
  );
}


}
