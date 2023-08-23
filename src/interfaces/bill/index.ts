import { CustomerInterface } from 'interfaces/customer';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import { GetQueryInterface } from 'interfaces';

export interface BillInterface {
  id?: string;
  customer_id: string;
  meter_reading_id: string;
  bill_date?: any;
  bill_amount?: number;
  bill_paid?: boolean;
  created_at?: any;
  updated_at?: any;

  customer?: CustomerInterface;
  meter_reading?: MeterReadingInterface;
  _count?: {};
}

export interface BillGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_id?: string;
  meter_reading_id?: string;
}
