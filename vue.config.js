module.exports = {
  assetsDir: "static",
  outputDir: "./docs",
  indexPath: "./index.html",
//  devServer: {
//    proxy: "http://localhost:4200",
//    overlay: false
//  },
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");

    svgRule.uses.clear();

    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  }
};