import {defineConfig} from 'vite';
import darkColors from './theme/dark-colors.mjs';
export default defineConfig({css:{postcss:{plugins:[darkColors()]}},server:{proxy:{'/api':'http://127.0.0.1:4000'}}});
