module.exports = function shortenAddress(address) {
  return address.replace(/, United States$/, '').replace('Minneapolis, Minnesota', 'Minneapolis, MN');
};
