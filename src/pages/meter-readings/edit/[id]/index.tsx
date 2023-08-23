import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getMeterReadingById, updateMeterReadingById } from 'apiSdk/meter-readings';
import { meterReadingValidationSchema } from 'validationSchema/meter-readings';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import { CustomerInterface } from 'interfaces/customer';
import { getCustomers } from 'apiSdk/customers';

function MeterReadingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<MeterReadingInterface>(
    () => (id ? `/meter-readings/${id}` : null),
    () => getMeterReadingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MeterReadingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMeterReadingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/meter-readings');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<MeterReadingInterface>({
    initialValues: data,
    validationSchema: meterReadingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Meter Readings',
              link: '/meter-readings',
            },
            {
              label: 'Update Meter Reading',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Meter Reading
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="reading_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Reading Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.reading_date ? new Date(formik.values?.reading_date) : null}
              onChange={(value: Date) => formik.setFieldValue('reading_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Reading Value"
            formControlProps={{
              id: 'reading_value',
              isInvalid: !!formik.errors?.reading_value,
            }}
            name="reading_value"
            error={formik.errors?.reading_value}
            value={formik.values?.reading_value}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('reading_value', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl
            id="bill_calculated"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.bill_calculated}
          >
            <FormLabel htmlFor="switch-bill_calculated">Bill Calculated</FormLabel>
            <Switch
              id="switch-bill_calculated"
              name="bill_calculated"
              onChange={formik.handleChange}
              value={formik.values?.bill_calculated ? 1 : 0}
            />
            {formik.errors?.bill_calculated && <FormErrorMessage>{formik.errors?.bill_calculated}</FormErrorMessage>}
          </FormControl>

          <NumberInput
            label="Bill Amount"
            formControlProps={{
              id: 'bill_amount',
              isInvalid: !!formik.errors?.bill_amount,
            }}
            name="bill_amount"
            error={formik.errors?.bill_amount}
            value={formik.values?.bill_amount}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('bill_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<CustomerInterface>
            formik={formik}
            name={'customer_id'}
            label={'Select Customer'}
            placeholder={'Select Customer'}
            fetcher={getCustomers}
            labelField={'address'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/meter-readings')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'meter_reading',
    operation: AccessOperationEnum.UPDATE,
  }),
)(MeterReadingEditPage);
