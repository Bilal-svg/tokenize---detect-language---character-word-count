import WinkTokenizer from 'wink-tokenizer';
import { franc } from 'franc';

const tokenizer = new WinkTokenizer();

export function tokenizeText(text: string): string[] {
  console.log('🚀 ~ tokenizeText ~ text:', text);

  if (typeof text !== 'string') {
    throw new Error('Input must be a string');
  }
  const lang = franc(text);
  if (
    !text.includes(' ') &&
    (lang === 'ace' || lang === 'cmn' || lang === 'jpn')
  ) {
    return Array.from(text);
  } else {
    return tokenizer
      .tokenize(text)
      .map((token: { value: string }) => token.value);
  }
}
