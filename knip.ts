import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['bin/postprocess.js'],
  ignoreDependencies: ['@flydotio/dockerfile'],
};

export default config;
