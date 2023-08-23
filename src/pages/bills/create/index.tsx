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

import { createBill } from 'apiSdk/bills';
import { billValidationSchema } from 'validationSchema/bills';
import { CustomerInterface } from 'interfaces/customer';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import { getCustomers } from 'apiSdk/customers';
import { getMeterReadings } from 'apiSdk/meter-readings';
import { BillInterface } from 'interfaces/bill';

function BillCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BillInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBill(values);
      resetForm();
      router.push('/bills');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BillInterface>({
    initialValues: {
      bill_date: new Date(new Date().toDateString()),
      bill_amount: 0,
      bill_paid: false,
      customer_id: (router.query.customer_id as string) ?? null,
      meter_reading_id: (router.query.meter_reading_id as string) ?? null,
    },
    validationSchema: billValidationSchema,
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
              label: 'Bills',
              link: '/bills',
            },
            {
              label: 'Create Bill',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Bill
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="bill_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Bill Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.bill_date ? new Date(formik.values?.bill_date) : null}
              onChange={(value: Date) => formik.setFieldValue('bill_date', value)}
            />
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

          <FormControl id="bill_paid" display="flex" alignItems="center" mb="4" isInvalid={!!formik.errors?.bill_paid}>
            <FormLabel htmlFor="switch-bill_paid">Bill Paid</FormLabel>
            <Switch
              id="switch-bill_paid"
              name="bill_paid"
              onChange={formik.handleChange}
              value={formik.values?.bill_paid ? 1 : 0}
            />
            {formik.errors?.bill_paid && <FormErrorMessage>{formik.errors?.bill_paid}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CustomerInterface>
            formik={formik}
            name={'customer_id'}
            label={'Select Customer'}
            placeholder={'Select Customer'}
            fetcher={getCustomers}
            labelField={'address'}
          />
          <AsyncSelect<MeterReadingInterface>
            formik={formik}
            name={'meter_reading_id'}
            label={'Select Meter Reading'}
            placeholder={'Select Meter Reading'}
            fetcher={getMeterReadings}
            labelField={'reading_date'}
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
              onClick={() => router.push('/bills')}
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
    entity: 'bill',
    operation: AccessOperationEnum.CREATE,
  }),
)(BillCreatePage);
