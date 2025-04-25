"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalExamination = void 0;
const doctor_entity_1 = require("../doctor/doctor.entity");
const patient_entity_1 = require("../patient/patient.entity");
const typeorm_1 = require("typeorm");
let MedicalExamination = class MedicalExamination {
    id;
    date;
    motivation;
    note;
    patient;
    doctor;
};
exports.MedicalExamination = MedicalExamination;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MedicalExamination.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], MedicalExamination.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MedicalExamination.prototype, "motivation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MedicalExamination.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient, (patient) => patient.medicalExaminations, { onDelete: 'CASCADE' }),
    __metadata("design:type", patient_entity_1.Patient)
], MedicalExamination.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => doctor_entity_1.Doctor, (doctor) => doctor.medicalExaminations, { onDelete: 'CASCADE' }),
    __metadata("design:type", doctor_entity_1.Doctor)
], MedicalExamination.prototype, "doctor", void 0);
exports.MedicalExamination = MedicalExamination = __decorate([
    (0, typeorm_1.Entity)()
], MedicalExamination);
//# sourceMappingURL=medical-examination.entity.js.map