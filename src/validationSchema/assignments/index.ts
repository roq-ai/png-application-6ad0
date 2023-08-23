import * as yup from 'yup';

export const assignmentValidationSchema = yup.object().shape({
  assignment_date: yup.date().nullable(),
  account_manager_id: yup.string().nullable().required(),
  meter_reader_id: yup.string().nullable().required(),
  customer_id: yup.string().nullable().required(),
});
