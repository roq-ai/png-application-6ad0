import * as yup from 'yup';

export const meterReadingValidationSchema = yup.object().shape({
  reading_date: yup.date().nullable(),
  reading_value: yup.number().integer().nullable(),
  bill_calculated: yup.boolean().nullable(),
  bill_amount: yup.number().integer().nullable(),
  customer_id: yup.string().nullable().required(),
});
