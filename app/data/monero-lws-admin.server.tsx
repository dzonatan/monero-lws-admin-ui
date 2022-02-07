import { exec } from 'child_process';
import { AccountList, AddressUpdated, RequestList } from './data.model';

export async function listAccounts() {
  return await execute<AccountList>('list_accounts');
}

export async function listRequests() {
  return await execute<RequestList>('list_requests');
}

export async function acceptRequest({
  type,
  address,
}: {
  type: string;
  address: string;
}) {
  return await execute<AddressUpdated>(`accept_requests ${type} ${address}`);
}

export async function rejectRequest({
  type,
  address,
}: {
  type: string;
  address: string;
}) {
  return await execute<AddressUpdated>(`reject_requests ${type} ${address}`);
}

export async function modifyAccountStatus({
  status,
  address,
}: {
  status: 'active' | 'inactive' | 'hidden';
  address: string;
}) {
  return await execute<AddressUpdated>(
    `modify_account_status ${status} ${address}`
  );
}

export async function rescanAccount({
  height,
  address,
}: {
  height: number;
  address: string;
}) {
  return await execute<AddressUpdated>(`rescan ${height} ${address}`);
}

function execute<TModel>(cmd: string) {
  return new Promise<TModel>((resolve, reject) => {
    exec(`monero-lws-admin ${cmd}`, {}, (error, stdout) => {
      if (error) {
        reject(error.message);
        return;
      }
      resolve(JSON.parse(stdout));
    });
  });
}
