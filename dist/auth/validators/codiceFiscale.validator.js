"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCodiceFiscaleConstraint = void 0;
exports.IsCodiceFiscale = IsCodiceFiscale;
const class_validator_1 = require("class-validator");
const CodiceFiscale = require('codice-fiscale-js');
let IsCodiceFiscaleConstraint = class IsCodiceFiscaleConstraint {
    validate(codiceFiscale) {
        return CodiceFiscale.check(codiceFiscale);
    }
    defaultMessage() {
        return 'Codice Fiscale non valido';
    }
};
exports.IsCodiceFiscaleConstraint = IsCodiceFiscaleConstraint;
exports.IsCodiceFiscaleConstraint = IsCodiceFiscaleConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], IsCodiceFiscaleConstraint);
function IsCodiceFiscale(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCodiceFiscaleConstraint,
        });
    };
}
//# sourceMappingURL=codiceFiscale.validator.js.map