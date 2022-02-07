import { useState } from 'react';
import { Form, useTransition } from 'remix';
import { Account, AccountList } from '~/data/data.model';
import { formatDate, shortenAddress } from '~/utils/formatters';
import Address from './address';
import Button from './button';

function AccountItem({
  account,
  status,
}: {
  account: Account;
  status: 'active' | 'inactive' | 'hidden';
}) {
  const [height, setHeight] = useState(account.scan_height);
  const { state, submission } = useTransition();

  function actionPending(action: string) {
    return (
      state === 'submitting' &&
      submission?.formData.get('address') === account.address &&
      submission.formData.get('_action') === action
    );
  }

  return (
    <tr>
      <td>
        <Address address={account.address} />
      </td>
      <td className="space-x-2">
        {status === 'active' ? (
          <Form method="post">
            <input type="hidden" name="address" value={account.address} />
            <input
              type="number"
              name="blockHeight"
              className="w-20 p-0 text-sm"
              value={height}
              onChange={({ target }) => setHeight(+target.value)}
              aria-label="block height"
              min="0"
            />
            <Button
              type="submit"
              name="_action"
              primary={true}
              value="rescan-account"
              className="ml-4"
              aria-label={`Rescan ${shortenAddress(account.address)}`}
              disabled={actionPending('rescan-account')}
            >
              Rescan
            </Button>
          </Form>
        ) : (
          account.scan_height
        )}
      </td>
      <td suppressHydrationWarning>{formatDate(account.access_time)}</td>
      <td>
        {status === 'active' && (
          <span className="badge bg-green-100 text-green-800">Active</span>
        )}
        {status === 'inactive' && (
          <span className="badge bg-red-100 text-red-800">Inactive</span>
        )}
        {status === 'hidden' && (
          <span className="badge bg-gray-100 text-gray-800">Hidden</span>
        )}
      </td>
      <td className="text-right">
        <Form method="post" className="space-x-4">
          <input type="hidden" name="address" value={account.address} />
          {status !== 'inactive' && (
            <Button
              type="submit"
              name="_action"
              value="deactivate-account"
              aria-label={`Deactivate ${shortenAddress(account.address)}`}
              disabled={actionPending('deactivate-account')}
            >
              Deactivate
            </Button>
          )}
          {status !== 'active' && (
            <Button
              type="submit"
              name="_action"
              primary={true}
              value="activate-account"
              aria-label={`Activate ${shortenAddress(account.address)}`}
              disabled={actionPending('activate-account')}
            >
              Activate
            </Button>
          )}
          {status !== 'hidden' && (
            <Button
              type="submit"
              name="_action"
              value="hide-account"
              aria-label={`Hide ${shortenAddress(account.address)}`}
              disabled={actionPending('hide-account')}
            >
              Hide
            </Button>
          )}
        </Form>
      </td>
    </tr>
  );
}

export default function Accounts({ accounts }: { accounts: AccountList }) {
  const anyAccount =
    !!accounts?.active?.length ||
    !!accounts?.inactive?.length ||
    !!accounts?.hidden?.length;

  return (
    <div className="panel">
      <h2 id="accountsHeading" className="panel-heading">
        Accounts
      </h2>
      <div className="panel-body">
        <table className="min-w-full table" aria-labelledby="accountsHeading">
          <thead>
            <tr>
              <th scope="col">Address</th>
              <th scope="col">At height</th>
              <th scope="col">Last accessed</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>

          <tbody>
            {!anyAccount && (
              <tr>
                <td colSpan={5}>no accounts</td>
              </tr>
            )}
            {accounts?.active?.map((account, i) => (
              <AccountItem key={i} account={account} status="active" />
            ))}
            {accounts?.inactive?.map((account, i) => (
              <AccountItem key={i} account={account} status="inactive" />
            ))}
            {accounts?.hidden?.map((account, i) => (
              <AccountItem key={i} account={account} status="hidden" />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
