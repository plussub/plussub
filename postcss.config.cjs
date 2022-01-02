module.exports = {
  plugins: [
    {tailwindcss: {}},
    {autoprefixer: {}},
    require('cssnano')({preset: 'default'})
  ]
}
