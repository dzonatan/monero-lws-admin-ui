export type Request = {
  address: string;
  start_height: number;
};

export type RequestList = {
  create?: Request[];
  import?: Request[];
};

export type Account = {
  address: string;
  scan_height: number;
  access_time: number;
};

export type AccountList = {
  active?: Account[];
  inactive?: Account[];
  hidden?: Account[];
};

export type AddressUpdated = {
  updated: string[];
};
