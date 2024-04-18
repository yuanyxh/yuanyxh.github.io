// eslint-disable-next-line no-undef
module.exports = {
  install: function (less, pluginManager, functions) {
    functions.add('minianimation', function (...args) {
      let result = '';
      for (let i = 0; i < args.length; i++) {
        result += `${args[i].value} 0.1s ease 0.1s`;

        result += i !== args.length - 1 ? ', ' : ';';
      }

      return result;
    });

    functions.add('flexShrink', function (num) {
      return `flex-shrink: ${num.value}`;
    });
  }
};
