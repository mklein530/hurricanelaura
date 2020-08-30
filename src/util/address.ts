export const getPlaceAsAddress = (detail: any) => {
  const addressComponents = { city: '', state: '', zip: '', country: '', street: '' };
  if (detail.address_components) {
    let floor = detail.address_components.find(component => component.types.includes('floor'));
    if (floor) {
      floor = floor.short_name;
    }
    let streetNumber = detail.address_components.find(component => component.types.includes('street_number'));
    if (streetNumber) {
      streetNumber = streetNumber.long_name;
    }
    let street = detail.address_components.find(component => component.types.includes('route'));
    if (street) {
      if (floor && streetNumber && street.long_name) {
        street = floor + ' ' + streetNumber + ' ' + street.long_name;
      } else if (streetNumber && street.long_name) {
        street = streetNumber + ' ' + street.long_name;
      } else {
        street = street.long_name;
      }
    }
    let city = detail.address_components.find(component => component.types.includes('locality'));
    if (city) {
      city = city.long_name;
    }
    let state = detail.address_components.find(component => component.types.includes('administrative_area_level_1'));
    if (state) {
      state = state.short_name;
    }
    let zip = detail.address_components.find(component => component.types.includes('postal_code'));
    if (zip) {
      zip = zip.long_name;
    }
    let country = detail.address_components.find(component => component.types.includes('country'));
    if (country) {
      country = country.long_name;
    }
    addressComponents.city = city;
    addressComponents.state = state;
    addressComponents.zip = zip;
    addressComponents.country = country;
    addressComponents.street = street;
  }
  let lat = detail.geometry.location.lat();
  let lng = detail.geometry.location.lng();
  return {
    ...addressComponents,
    lat,
    lng
  };
};