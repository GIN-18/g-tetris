const $ = require('jquery')

class Partition {
  constructor() {
   this.element = '<div id="partition" class="absolute top-0 left-0 w-full h-full bg-crust bg-opacity-95"></div>'
  }

  // 显示分隔层
  showPartition () {
    $('body').append(this.element);
  }

  // 隐藏分隔层
  hidePartition () {
    $('#partition').remove();
  }
}

module.exports = Partition;