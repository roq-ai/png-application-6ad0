import { UserInterface } from 'interfaces/user';
import { CustomerInterface } from 'interfaces/customer';
import { GetQueryInterface } from 'interfaces';

export interface AssignmentInterface {
  id?: string;
  account_manager_id: string;
  meter_reader_id: string;
  customer_id: string;
  assignment_date?: any;
  created_at?: any;
  updated_at?: any;

  user_assignment_account_manager_idTouser?: UserInterface;
  user_assignment_meter_reader_idTouser?: UserInterface;
  customer?: CustomerInterface;
  _count?: {};
}

export interface AssignmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  account_manager_id?: string;
  meter_reader_id?: string;
  customer_id?: string;
}
