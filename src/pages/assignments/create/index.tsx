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

import { createAssignment } from 'apiSdk/assignments';
import { assignmentValidationSchema } from 'validationSchema/assignments';
import { UserInterface } from 'interfaces/user';
import { CustomerInterface } from 'interfaces/customer';
import { getUsers } from 'apiSdk/users';
import { getCustomers } from 'apiSdk/customers';
import { AssignmentInterface } from 'interfaces/assignment';

function AssignmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AssignmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAssignment(values);
      resetForm();
      router.push('/assignments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AssignmentInterface>({
    initialValues: {
      assignment_date: new Date(new Date().toDateString()),
      account_manager_id: (router.query.account_manager_id as string) ?? null,
      meter_reader_id: (router.query.meter_reader_id as string) ?? null,
      customer_id: (router.query.customer_id as string) ?? null,
    },
    validationSchema: assignmentValidationSchema,
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
              label: 'Assignments',
              link: '/assignments',
            },
            {
              label: 'Create Assignment',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Assignment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="assignment_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Assignment Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.assignment_date ? new Date(formik.values?.assignment_date) : null}
              onChange={(value: Date) => formik.setFieldValue('assignment_date', value)}
            />
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'account_manager_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'meter_reader_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
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
              onClick={() => router.push('/assignments')}
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
    entity: 'assignment',
    operation: AccessOperationEnum.CREATE,
  }),
)(AssignmentCreatePage);
