export default function shortenAddress(address: string) {
  return address.replace(/, USA$/, '');
}
