const SZ_STRING = 2;
const SZ_BOOL = 4;
const SZ_NUMBER = 8;

function sizeOfObject(object) {
  if (object == null) {
    return 0;
  }

  let bytes = 0;
  for (const key in object) {
    bytes += sizeof(key);
    try {
      bytes += sizeof(object[key]);
    } catch (ex) {
      if (ex instanceof RangeError) {
        bytes = 0;
      }
    }
  }

  return bytes;
}

const accSize = (acc, v) => acc + sizeof(v);

function sizeof(object) {
  switch (typeof object) {
    case 'string':
      return object.length * SZ_STRING;
    case 'boolean':
      return SZ_BOOL;
    case 'number':
      return SZ_NUMBER;
    case 'object':
    if (Array.isArray(object)) {
      return object.reduce(accSize, 0);
    }
      return sizeOfObject(object);
    default:
      return 0;
  }
}

module.exports = sizeof;