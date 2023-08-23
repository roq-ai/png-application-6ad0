import * as yup from 'yup';

export const customerValidationSchema = yup.object().shape({
  address: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  zip_code: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
  account_manager_id: yup.string().nullable().required(),
  meter_reader_id: yup.string().nullable().required(),
});
