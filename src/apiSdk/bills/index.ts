import axios from 'axios';
import queryString from 'query-string';
import { BillInterface, BillGetQueryInterface } from 'interfaces/bill';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getBills = async (query?: BillGetQueryInterface): Promise<PaginatedInterface<BillInterface>> => {
  const response = await axios.get('/api/bills', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createBill = async (bill: BillInterface) => {
  const response = await axios.post('/api/bills', bill);
  return response.data;
};

export const updateBillById = async (id: string, bill: BillInterface) => {
  const response = await axios.put(`/api/bills/${id}`, bill);
  return response.data;
};

export const getBillById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bills/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBillById = async (id: string) => {
  const response = await axios.delete(`/api/bills/${id}`);
  return response.data;
};
