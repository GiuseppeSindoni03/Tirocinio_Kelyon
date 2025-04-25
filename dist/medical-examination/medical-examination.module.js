"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalExaminationModule = void 0;
const common_1 = require("@nestjs/common");
const medical_examination_service_1 = require("./medical-examination.service");
const medical_examination_controller_1 = require("./medical-examination.controller");
const typeorm_1 = require("@nestjs/typeorm");
const patient_entity_1 = require("../patient/patient.entity");
const doctor_entity_1 = require("../doctor/doctor.entity");
const medical_examination_entity_1 = require("./medical-examination.entity");
let MedicalExaminationModule = class MedicalExaminationModule {
};
exports.MedicalExaminationModule = MedicalExaminationModule;
exports.MedicalExaminationModule = MedicalExaminationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([patient_entity_1.Patient, doctor_entity_1.Doctor, medical_examination_entity_1.MedicalExamination])],
        providers: [medical_examination_service_1.MedicalExaminationService],
        controllers: [medical_examination_controller_1.MedicalExaminationController]
    })
], MedicalExaminationModule);
//# sourceMappingURL=medical-examination.module.js.map