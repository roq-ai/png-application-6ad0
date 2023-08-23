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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createMeterReading } from 'apiSdk/meter-readings';
import { meterReadingValidationSchema } from 'validationSchema/meter-readings';
import { CustomerInterface } from 'interfaces/customer';
import { getCustomers } from 'apiSdk/customers';
import { MeterReadingInterface } from 'interfaces/meter-reading';

function MeterReadingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MeterReadingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMeterReading(values);
      resetForm();
      router.push('/meter-readings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MeterReadingInterface>({
    initialValues: {
      reading_date: new Date(new Date().toDateString()),
      reading_value: 0,
      bill_calculated: false,
      bill_amount: 0,
      customer_id: (router.query.customer_id as string) ?? null,
    },
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
              label: 'Create Meter Reading',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Meter Reading
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
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
    operation: AccessOperationEnum.CREATE,
  }),
)(MeterReadingCreatePage);
