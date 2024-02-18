export const stringNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export const specialCharacters = [
  '.',
  '*',
  '/',
  '-',
  ';',
  '{',
  '}',
  '[',
  ']',
  '?',
  '\\',
  '+',
  ':',
  '`',
  '~',
  '_',
  '=',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  '',
  '|',
  ',',
  ' ',
];
export const lowercaseLetters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
export const uppercaseLetters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export const MAX_IMAGE_FILE_SIZE_IN_BYTES = 1024 * 1024 * 5;
export const MAX_VIDEO_FILE_SIZE_IN_BYTES = 1024 * 1024 * 25;
export const MAX_DOCUMENT_FILE_SIZE_IN_BYTES = 1024 * 1024 * 1;
export const MAX_VOICE_FILE_SIZE_IN_BYTES = 1024 * 1024 * 10;

export const ALLOWED_IMAGE_FORMATS = ['.png', '.jpeg', '.bmp', '.jpg'];
export const ALLOWED_VIDEO_FORMATS = ['.mp4', '.mov'];
export const ALLOWED_DOCUMENT_FORMATS = [
  '.pdf',
  '.docs',
  '.docx',
  '.doc',
  '.pptx',
];
export const ALLOWED_VOICE_FORMATS = ['.mp3'];

export const GLOBAL_VALIDATION = {
  PHONE_NUMBER: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 18,
  },
  USER_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 20,
  },

  FIRST_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 64,
  },
  LAST_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 64,
  },
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 320,
  },
  URL: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 2048,
  },
  LAT: {
    MIN: -90,
    MAX: 90,
  },
  LON: {
    MIN: -180,
    MAX: 180,
  },

  PASSWORD: {
    MAX_LENGTH: 30,
    MIN_LENGTH: 8,
  },
};
