import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsCodiceFiscaleConstraint implements ValidatorConstraintInterface {
    validate(codiceFiscale: string): any;
    defaultMessage(): string;
}
export declare function IsCodiceFiscale(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
