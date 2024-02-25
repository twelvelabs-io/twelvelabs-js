// Converts object keys from snake_case or leading underscore format to camelCase.
// This function is recursive, so it works on nested objects and arrays of objects as well.
//
// Examples:
// 1. Converting simple object keys:
//    Input: {"first_name": "John", "last_name": "Doe"}
//    Output: {"firstName": "John", "lastName": "Doe"}
//
// 2. Handling keys with leading underscores:
//    Input: {"_id": 123, "user_name": "johndoe"}
//    Output: {"id": 123, "userName": "johndoe"}
//
// 3. Working with nested objects:
//    Input: {"user_details": {"first_name": "John", "last_name": "Doe"}}
//    Output: {"userDetails": {"firstName": "John", "lastName": "Doe"}}
//
// 4. Processing arrays of objects:
//    Input: [{"user_name": "johndoe"}, {"user_name": "janedoe"}]
//    Output: [{"userName": "johndoe"}, {"userName": "janedoe"}]
export function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      // Check if key starts with "_"
      if (key.startsWith('_')) {
        // If so, remove the underscore and use the rest of the key as is
        const newKey = key.substring(1);
        return {
          ...result,
          [newKey]: convertKeysToCamelCase(obj[key]),
        };
      } else {
        // Use the existing replacement logic for other keys
        const camelCaseKey = key.replace(/([-_][a-z])/g, (group) =>
          group.toUpperCase().replace('-', '').replace('_', ''),
        );
        return {
          ...result,
          [camelCaseKey]: convertKeysToCamelCase(obj[key]),
        };
      }
    }, {});
  }
  return obj;
}

// Convert keys of an object from camelCase to snake_case, always applying deeply
export function convertKeysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item)); // Recursively apply to array elements
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        acc[snakeKey] = convertKeysToSnakeCase(obj[key]); // Recursively apply to nested objects
        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return obj;
}
