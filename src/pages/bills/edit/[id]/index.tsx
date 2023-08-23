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
import { getBillById, updateBillById } from 'apiSdk/bills';
import { billValidationSchema } from 'validationSchema/bills';
import { BillInterface } from 'interfaces/bill';
import { CustomerInterface } from 'interfaces/customer';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import { getCustomers } from 'apiSdk/customers';
import { getMeterReadings } from 'apiSdk/meter-readings';

function BillEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<BillInterface>(
    () => (id ? `/bills/${id}` : null),
    () => getBillById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BillInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBillById(id, values);
      mutate(updated);
      resetForm();
      router.push('/bills');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<BillInterface>({
    initialValues: data,
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
              label: 'Update Bill',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Bill
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(BillEditPage);
