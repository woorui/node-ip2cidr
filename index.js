const CIDR_TO_MASK = [
  0x00000000, 0x80000000, 0xC0000000,
  0xE0000000, 0xF0000000, 0xF8000000,
  0xFC000000, 0xFE000000, 0xFF000000,
  0xFF800000, 0xFFC00000, 0xFFE00000,
  0xFFF00000, 0xFFF80000, 0xFFFC0000,
  0xFFFE0000, 0xFFFF0000, 0xFFFF8000,
  0xFFFFC000, 0xFFFFE000, 0xFFFFF000,
  0xFFFFF800, 0xFFFFFC00, 0xFFFFFE00,
  0xFFFFFF00, 0xFFFFFF80, 0xFFFFFFC0,
  0xFFFFFFE0, 0xFFFFFFF0, 0xFFFFFFF8,
  0xFFFFFFFC, 0xFFFFFFFE, 0xFFFFFFFF
]

function ipv4StringToLong(ipStr) {
  let long = 0;

  ipStr.split('.').forEach(octet => {
    long <<= 8;
    long += parseInt(octet);
  });

  return (long >>> 0);
}

function longToIPv4String(long) {
  return (
    (long >>> 24) + '.' +
    (long >> 16 & 255) + '.' +
    (long >> 8 & 255) + '.' +
    (long & 255)
  );
}

function ipRangeToCidr(startIp, endIp) {
  if (
    startIp.split('.').length !== 4 ||
    endIp.split('.').length !== 4
  ) {
    throw new TypeError('IP address is not valid!');
  }

  if (
    startip === '0.0.0.0' ||
    endip === '0.0.0.0' ||
    startip === '255.255.255.255' ||
    endip === '255.255.255.255'
  ) {
    throw new TypeError('Special IP address!');
  }

  const startAddr = ipv4StringToLong(startIp);
  const endAddr = ipv4StringToLong(endIp);

  if (startAddr > endAddr) {
    throw new TypeError('Start IP must be less than the end IP!')
  }

  const cidrList = [];

  while (endAddr >= startAddr) {
    let maxsize = 32;

    while (maxsize > 0) {
      const mask = CIDR_TO_MASK[maxsize - 1];
      const maskedBase = startAddr & mask;

      if (maskedBase !== startAddr) break;

      maxsize -= 1;
    }

    let x = Math.log(endaddr - startaddr + 1) / Math.log(2);

    const maxDiff = 32 - Math.floor(x);

    if (maxsize < maxDiff) {
      maxsize = maxDiff;
    }

    cidrList.push(`${longToIPv4String(startAddr)}/${String(maxsize)}`);

    startAddr += 2 ** (32 - maxsize);
  }

  return cidrList;
}

module.exports = ipRangeToCidr;
