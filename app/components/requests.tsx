import { Form, useTransition } from 'remix';
import { RequestList, Request } from '~/data/data.model';
import { shortenAddress } from '~/utils/formatters';
import Address from './address';
import Button from './button';

function RequestItem({ request, type }: { request: Request; type: string }) {
  const { state, submission } = useTransition();

  function actionPending(action: string) {
    return (
      state === 'submitting' &&
      submission?.formData.get('address') === request.address &&
      submission.formData.get('_action') === action
    );
  }

  return (
    <tr>
      <td>{type}</td>
      <td>
        <Address address={request.address} />
      </td>
      <td>{request.start_height}</td>
      <td className="text-right">
        <Form replace method="post" className="space-x-4">
          <input type="hidden" name="address" value={request.address} />
          <input type="hidden" name="type" value={type} />
          <Button
            type="submit"
            name="_action"
            primary={true}
            value="accept-request"
            aria-label={`Accept request to ${type} ${shortenAddress(
              request.address
            )}`}
            disabled={actionPending('accept-request')}
          >
            Accept
          </Button>{' '}
          <Button
            type="submit"
            name="_action"
            value="reject-request"
            aria-label={`Reject request to ${type} ${shortenAddress(
              request.address
            )}`}
            disabled={actionPending('reject-request')}
          >
            Reject
          </Button>
        </Form>
      </td>
    </tr>
  );
}

export default function Requests({ requests }: { requests: RequestList }) {
  const anyRequest = !!requests?.create?.length || !!requests?.import?.length;

  return (
    <div className="panel">
      <h2 id="requestsHeading" className="panel-heading">
        Requests
      </h2>
      <div className="panel-body">
        <table className="min-w-full table" aria-labelledby="requestsHeading">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Address</th>
              <th scope="col">At height</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {!anyRequest ? (
              <tr>
                <td colSpan={4}>no requests</td>
              </tr>
            ) : (
              Object.entries(requests).map(([type, reqs]) =>
                reqs.map((request) => (
                  <RequestItem
                    key={request.address}
                    request={request}
                    type={type}
                  />
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
