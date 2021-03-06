const moment = require('moment');

module.exports = {
  truncate: function(str, len) {
    if(str.length > len && str.length > 0) {
      var new_str = str + '';
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
      return new_str + '...';
    }
  return str;
  },
  stripTags: function(str) {
    return str.replace(/<(?:.|\n)*?>/gm, '');
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  select: function(selected, options) {
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  editIcon: function(blogUser, loggedUser, blogId, floating = true) {
    if(blogUser == loggedUser) {
      if(floating) {
        return `<a href="/blogs/update/${blogId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/blogs/update/${blogId}"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return '';
    }
  }
}