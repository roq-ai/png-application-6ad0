import { BillInterface } from 'interfaces/bill';
import { CustomerInterface } from 'interfaces/customer';
import { GetQueryInterface } from 'interfaces';

export interface MeterReadingInterface {
  id?: string;
  customer_id: string;
  reading_date?: any;
  reading_value?: number;
  bill_calculated?: boolean;
  bill_amount?: number;
  created_at?: any;
  updated_at?: any;
  bill?: BillInterface[];
  customer?: CustomerInterface;
  _count?: {
    bill?: number;
  };
}

export interface MeterReadingGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_id?: string;
}
