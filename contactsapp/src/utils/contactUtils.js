export function filterContacts(contacts, searchQuery, searchType) {
  /**
   * Filters the list of contacts based on the search query and search type.
   *
   * @param {Array} contacts - The array of contact objects to filter.
   * @param {string} searchQuery - The search query input by the user.
   * @param {string} searchType - The type of field to search on (e.g., "name", "company", or "email").
   * @returns {Array} - A filtered array of contact objects that match the search query based on the selected search type.
   * 
   */

  return contacts.filter(contact => {
    let value = "";
    if (searchType === "name") {
      value = contact.name;
    } else if (searchType === "company" && contact[searchType]) {
      value = contact.company && contact.company.name;
    } else if (searchType === "email") {
      value = contact.email;
    }
    return value.toLowerCase().includes(searchQuery.toLowerCase());
  });
}

export function sortContacts(contacts, ascending) {
  /**
   * Sorts the list of contacts alphabetically based on their names in ascending or descending order.
   *
   * @param {Array} contacts - The array of contact objects to sort.
   * @param {boolean} ascending - Determines the sort order:
   *                              `true` for ascending (A-Z),
   *                              `false` for descending (Z-A).
   * @returns {Array} - A new sorted array of contact objects.
   * 
   */

  return [...contacts].sort((a, b) => {
    return ascending
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });
}


export function formValidation(newContact, rules) {
  /**
   * Validates the form data for creating or updating a contact.
   *
   * @param {Object} newContact - The contact object being validated. It should include:
   *                              `name`, `email`, and `phone` properties.
   * @param {Object} rules - Validation rules for the contact fields. It should include:
   *                         `nameRules`, `emailRules`, and `phoneRules` as arrays of functions.
   * @returns {boolean} - Returns `true` if all fields are valid according to the specified rules; otherwise, `false`.
   */

  return (
    newContact.name &&
    newContact.email &&
    newContact.phone &&
    rules.nameRules.every(rule => rule(newContact.name) === true) &&
    rules.emailRules.every(rule => rule(newContact.email) === true) &&
    rules.phoneRules.every(rule => rule(newContact.phone) === true)
  );
}
