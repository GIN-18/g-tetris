const $ = require('jquery')

class Sparator {
  constructor() {
    this.element = '<div id="sparator" class="absolute top-0 left-0 w-full h-full bg-crust bg-opacity-95"></div>'
  }

  showSparator() {
    $('body').append(this.element)
  }

  hideSparator() {
    $('#sparator').remove()
  }
}

module.exports = Sparator