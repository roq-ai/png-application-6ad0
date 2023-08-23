import { AssignmentInterface } from 'interfaces/assignment';
import { BillInterface } from 'interfaces/bill';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CustomerInterface {
  id?: string;
  user_id: string;
  account_manager_id: string;
  meter_reader_id: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_at?: any;
  updated_at?: any;
  assignment?: AssignmentInterface[];
  bill?: BillInterface[];
  meter_reading?: MeterReadingInterface[];
  user_customer_user_idTouser?: UserInterface;
  user_customer_account_manager_idTouser?: UserInterface;
  user_customer_meter_reader_idTouser?: UserInterface;
  _count?: {
    assignment?: number;
    bill?: number;
    meter_reading?: number;
  };
}

export interface CustomerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  account_manager_id?: string;
  meter_reader_id?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}
