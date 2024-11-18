export function validateText(text: string): { valid: boolean; error?: string } {
  if (text.length > 2000) {
    return {
      valid: false,
      error: 'Text exceeds maximum length of 2000 characters.',
    };
  }

  // Uncomment this if you want to validate special characters
  // const specialCharRegex = /[^\p{L}\p{N}\s]/u;
  // if (specialCharRegex.test(text)) {
  //   return { valid: false, error: 'Text contains special characters.' };
  // }

  return { valid: true };
}
