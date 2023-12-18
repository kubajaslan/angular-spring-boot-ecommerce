import { FormControl, ValidationErrors } from "@angular/forms";

export class EcommerceValidators {
    static notOnlyWhitespace(control: FormControl): ValidationErrors {
        if (control.value != null && control.value.trim() == 0) {
            return { 'notOnlyWhitespace': true };
        } else {
            return null;
        }
    }

    static zipCodeValidator(control: FormControl) {
        const zipCodeRegex = '^[0-9]{2}\-[0-9]{3}$';
       
        if (!control.value.match(zipCodeRegex) && control.value != '') {
            return { 'invalidZipCode': true };
        }

        return null;
    }
}
