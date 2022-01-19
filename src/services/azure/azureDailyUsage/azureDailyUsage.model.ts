import { ISearch } from '../../../common/models/common';
import { Moment } from 'moment';

export interface IAzureDailyUsage {
  id?: number;
  company_id?: number;
  bu_id?: number;
  account_owner_id?: string;
  account_name?: string;
  service_administrator_id?: string;
  subscription_id?: string;
  subscription_guid?: string;
  meterSubCategory?: string;
  subscription_name?: string;
  date?: string | Moment;
  date_added?: string | Moment;
  month?: number;
  day?: number;
  year?: number;
  product?: string;
  meter_id?: string;
  meter_category?: string;
  meter_sub_category?: string;
  meter_region?: string;
  meter_name?: string;
  consumed_quantity?: number;
  resource_rate?: number;
  extended_cost?: number;
  resource_location?: string;
  consumed_service?: string;
  instance_id?: string;
  service_info1?: string;
  service_info2?: string;
  additional_info?: string;
  tags?: string;
  store_service_identifier?: string;
  department_name?: string;
  cost_center?: string;
  unit_of_measure?: string;
  resource_group?: string;
  charges_billed_separately?: boolean;
  billing_currency?: string;
  offer_id?: string;
  is_azure_credit_eligible?: boolean;
  billing_account_id?: string;
  billing_account_name?: string;
  billing_period_start_date?: string | Moment;
  billing_period_end_date?: string | Moment;
  billing_profile_id?: string;
  billing_profile_name?: string;
  part_number?: string;
  service_family?: string;
  unit_price?: number;
  availability_zone?: string;
  resource_name?: string;
  invoice_section_id?: string;
  invoice_section?: string;
  reservation_id?: string;
  reservation_name?: string;
  product_order_id?: string;
  product_order_name?: string;
  term?: number;
  publisher_name?: string;
  plan_name?: string;
  charge_type?: string;
  frequency?: string;
  publisher_type?: string;
  pay_g_price?: number;
  pricing_model?: string;
  idle?: boolean;
  idle_est_savings?: number;
  placement?: boolean;
  placement_est_savings?: number;
  vm_instance_id?: string;
  vm_resource_name?: string;
  ri_applied?: boolean;
  ri_suggested?: boolean;
  ri_est_savings?: number;
  ahb_applied?: boolean;
  ahb_suggested?: boolean;
  ahb_est_savings?: number;
  dev_test_applied?: boolean;
  dev_test_suggested?: boolean;
  dev_test_est_savings?: number;
  resource_rate_list?: number;
  discount?: number;
  rate_card_unit?: string;
  usage: number;
  growth?: number;
  month_name?: string;
  tenant_id: number;
  product_id?: string;
  resource_group_name?: string;
  resource_id?: string;
  location?: string;
  effective_price?: number;
  quantity?: number;
  pricing_currency?: string;
  cost_in_billing_currency?: number;
  cost_in_pricing_currency?: number;
  cost_in_usd?: number;
  payg_cost_in_billing_currency?: number;
  payg_cost_in_usd?: number;
  exchange_rate_pricing_to_billing?: number;
  exchange_rate_date?: string | Moment;
  cost?: number;
  environment?: string;
  environment_tags?: string;
  dev_test_eligible?: boolean;
}

export interface ISearchAzureDailyUsage extends ISearch {
  is_lookup?: boolean;
}

export interface IProcessData {
  company_id?: number;
  bu_id?: number;
  date_added?: Date;
}
