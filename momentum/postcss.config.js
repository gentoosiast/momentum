const postCssConfig = {
  syntax: 'postcss-scss',
  plugins: {
    autoprefixer: {},
    '@csstools/postcss-sass': {},
  },
};

if (process.env.NODE_ENV === 'production') {
  postCssConfig.plugins.cssnano = {
    preset: 'default',
  };
}

module.exports = postCssConfig;
