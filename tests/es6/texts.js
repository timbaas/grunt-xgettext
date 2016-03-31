import Model from 'model';
import Framework from 'framework';
import I18n from 'i18n';

const tr = I18n.translate;

class TestCase {

    constructor() {

    }

    async validate() {
        var model = new Model();
        await model.save();
        this.send("success", tr("Hallo from es6!"));
    }
}

export default TestCase;

export default Framework.Controller.extend({
    init: function() {
        var [name, b, c] = arguments[0];

        /// Say hallo will contain a name
        this.set("foobar", tr("hallo {{name}} ", {name: name}));
    }
});
