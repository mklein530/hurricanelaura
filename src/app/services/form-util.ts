export const getAddressDisplay = (street: string, city: string, state: string, zip: string) => {
  // <RatsText translate={false} text={selectedJob.street} style={{ fontSize: fontSize.medium }} />
  // <RatsText translate={false} text={`${selectedJob.city}, ${selectedJob.state} ${selectedJob.zip}`} style={{ fontSize: fontSize.medium }} />
  let address = '';
  if (street) {
    address += street;
  }
  if (city) {
    address += street ? ', ' + city : city;
  }
  if (state) {
    address += city ? ', ' + state : state;
  }
  if (zip) {
    address += state ? ' ' + zip : zip;
  }
  return address;
};

export const getAddressFromValue = (values: any, path: string = '') => {
  // if (value && (value.street || value.city || value.state || value.zip)) {
  //   return formatString(value.street) + formatString(value.city) + formatString(value.state) + formatString(value.zip);
  // } else {
  //   return '';
  // }
  let parts = path.split('.');
  parts = parts.slice(0, parts.length - 1);
  let accessor = values;
  for (let i = 0; i < parts.length; i++) {
    accessor = accessor[parts[i]];
  }
  accessor = accessor || {};
  return accessor;
};

export const formatPhoneNumber = (phoneNumberString) => {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};
