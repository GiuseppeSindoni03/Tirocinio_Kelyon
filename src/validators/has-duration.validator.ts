import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function HasDuration(
  minMinutes: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'hasDuration',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const { startTime, endTime } = args.object as any;
          if (!startTime || !endTime) return false;

          const start = new Date(startTime);
          const end = new Date(endTime);

          if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

          const durationMinutes =
            (end.getTime() - start.getTime()) / (1000 * 60);
          return durationMinutes === minMinutes;
        },
        defaultMessage: () =>
          `La durata deve essere esattamente di ${minMinutes} minuti.`,
      },
    });
  };
}
