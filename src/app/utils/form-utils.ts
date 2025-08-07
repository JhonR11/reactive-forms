import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from "@angular/forms";

// SImular una respuesta del backend
async function sleep() {
    return new Promise(resolve=>{
      setTimeout(()=>{
        resolve(true)

      },2500)
    })
  }

export class FormUtils {
    //Las expresiones regulares
      static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)';
      static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
      static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

    static isFieldOneEquialFieldTwo(field: string, field2: string){
    return (FormGroup: AbstractControl) =>{
      const fieldValue = FormGroup.get(field)?.value;
      const field2Value = FormGroup.get(field2)?.value;

      return fieldValue === field2Value ? null: { passwordsNotEqual: true}
        }
    }

    static getTextError(errors: ValidationErrors){
        for (const key of Object.keys(errors)) {
     switch (key) {
       case 'required':
          return 'Este campo es requerido'
       case 'minlength':
         return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

       case 'min':
         return `Valor mínimo de ${errors['min'].min}`;
      
       case 'email':
         return `El valodr ingresado no es un correo electronico`
       case 'emailTaken':
          return `El correo electronico ya esta tomado`
        case 'notStrider':
          return `El usuario ya esta tomado`
       
        default:
            return 'Error de validacion no controlado'
        }

    }
    return null
    }



    static isValidField( form: FormGroup, fieldName:string):boolean|null{
    return !!form.controls[fieldName].errors &&
            form.controls[fieldName].touched
  }


  static getFieldError(form: FormGroup,fieldName: string): string | null {
   if (!form.controls[fieldName]) return null;

   const errors = form.controls[fieldName].errors ?? {};
    return FormUtils.getTextError(errors)
  }



  static getFiedlArrayError(form: FormArray, index: number): string | null {
    if (form.controls.length ===0) return null;

   const errors = form.controls[index].errors ?? {};

   return FormUtils.getTextError(errors)
  }



  static isValidFieldInArray(FormArray: FormArray, index: number){
    return(
      FormArray.controls[index].errors && FormArray.controls[index].touched
    )
  }


  

  static async checkingServerResponse(control: AbstractControl):Promise< ValidationErrors|null >{
    await sleep()

    const formValue=control.value

    if(formValue==='hola@mundo.com'){
      return {
        emailTaken: true
      }
    }
    
    return null
  }

  static notStrider(control: AbstractControl): ValidationErrors|null{
    const Value=control.value

    return Value==='strider' ?{notStrider:true}:null

  }
}