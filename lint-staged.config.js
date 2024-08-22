/**
 *@type {import('lint-staged')}
 */
export default {
  '*.{ts,js}': ['eslint --max-warnings=0', 'prettier --write'],
  '!(*.ts|*.js)': ['prettier --write --ignore-unknown'],
};
