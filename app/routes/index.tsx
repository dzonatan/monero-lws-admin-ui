import { ActionFunction, LoaderFunction, useLoaderData } from 'remix';
import Accounts from '~/components/accounts';
import Requests from '~/components/requests';
import { AccountList, RequestList } from '~/data/data.model';
import {
  acceptRequest,
  listAccounts,
  listRequests,
  modifyAccountStatus,
  rejectRequest,
  rescanAccount,
} from '~/data/monero-lws-admin.server';
import ErrorAlert from '~/components/error-alert';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('_action');
  switch (action) {
    case 'accept-request':
      await acceptRequest({
        address: formData.get('address')!.toString(),
        type: formData.get('type')!.toString(),
      });
      break;
    case 'reject-request':
      await rejectRequest({
        address: formData.get('address')!.toString(),
        type: formData.get('type')!.toString(),
      });
      break;
    case 'activate-account':
      await modifyAccountStatus({
        address: formData.get('address')!.toString(),
        status: 'active',
      });
      break;
    case 'deactivate-account':
      await modifyAccountStatus({
        address: formData.get('address')!.toString(),
        status: 'inactive',
      });
      break;
    case 'hide-account':
      await modifyAccountStatus({
        address: formData.get('address')!.toString(),
        status: 'hidden',
      });
      break;
    case 'rescan-account':
      await rescanAccount({
        address: formData.get('address')!.toString(),
        height: +formData.get('blockHeight')!.toString(),
      });
      break;
    default:
      throw new Error(`Unknown "${action}" action.`);
  }
  return {};
};

export type LoaderData = {
  accounts?: AccountList;
  requests?: RequestList;
  error?: string;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  try {
    const accounts = await listAccounts();
    const requests = await listRequests();

    return { accounts, requests };
  } catch (error: unknown) {
    if (typeof error === 'string') {
      return { error };
    }
    return { error: JSON.stringify(error) };
  }
};

export default function Index() {
  const { accounts, requests, error } = useLoaderData<LoaderData>();

  return (
    <div className="min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">monero-lws-admin</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 grid grid-cols-1 gap-4">
        {requests && <Requests requests={requests} />}
        {accounts && <Accounts accounts={accounts} />}
        {error && <ErrorAlert errorMsg={error} />}
      </main>
    </div>
  );
}
