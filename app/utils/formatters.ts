export function shortenAddress(address: string) {
  return (
    address.substring(0, 5) + '...' + address.substring(address.length - 5)
  );
}

export function formatDate(seconds: number) {
  return new Date(seconds * 1000).toLocaleString();
}
