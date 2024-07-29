module.exports = {
  plugins: [
    {tailwindcss: {}},
    require('cssnano')({preset: 'default'})
  ]
}
