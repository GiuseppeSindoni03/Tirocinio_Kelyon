"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const patient_entity_1 = require("./patient.entity");
const patient_service_1 = require("./patient.service");
const patient_controller_1 = require("./patient.controller");
const codiceFiscale_validator_1 = require("../auth/validators/codiceFiscale.validator");
let PatientModule = class PatientModule {
};
exports.PatientModule = PatientModule;
exports.PatientModule = PatientModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                patient_entity_1.Patient
            ])
        ],
        providers: [
            patient_service_1.PatientService,
            codiceFiscale_validator_1.IsCodiceFiscaleConstraint,
        ],
        controllers: [patient_controller_1.PatientController],
        exports: [],
    })
], PatientModule);
//# sourceMappingURL=patient.module.js.map