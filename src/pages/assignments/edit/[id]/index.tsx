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
import { getAssignmentById, updateAssignmentById } from 'apiSdk/assignments';
import { assignmentValidationSchema } from 'validationSchema/assignments';
import { AssignmentInterface } from 'interfaces/assignment';
import { UserInterface } from 'interfaces/user';
import { CustomerInterface } from 'interfaces/customer';
import { getUsers } from 'apiSdk/users';
import { getCustomers } from 'apiSdk/customers';

function AssignmentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<AssignmentInterface>(
    () => (id ? `/assignments/${id}` : null),
    () => getAssignmentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AssignmentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAssignmentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/assignments');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<AssignmentInterface>({
    initialValues: data,
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
              label: 'Update Assignment',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Assignment
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(AssignmentEditPage);
