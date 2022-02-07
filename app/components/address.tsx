import { shortenAddress } from '~/utils/formatters';

export default function Address({ address }: { address: string }) {
  return <>{shortenAddress(address)}</>;
}
