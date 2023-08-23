import * as yup from 'yup';

export const billValidationSchema = yup.object().shape({
  bill_date: yup.date().nullable(),
  bill_amount: yup.number().integer().nullable(),
  bill_paid: yup.boolean().nullable(),
  customer_id: yup.string().nullable().required(),
  meter_reading_id: yup.string().nullable().required(),
});
