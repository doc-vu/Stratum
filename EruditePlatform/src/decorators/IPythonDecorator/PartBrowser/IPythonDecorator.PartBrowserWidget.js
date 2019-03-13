/*globals define, _*/
/*jshint browser: true*/
/**
 * This decorator inherits from the ModelDecorator.PartBrowserWidget.
 * With no changes to the methods - it will functions just like the ModelDecorator.
 *
 * For more methods see the ModelDecorator.PartBrowserWidget.js in the webgme repository.
 *
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'decorators/ModelDecorator/PartBrowser/ModelDecorator.PartBrowserWidget',
    'jquery',
    'underscore'
], function (ModelDecoratorPartBrowserWidget) {

    'use strict';

    var IPythonDecoratorPartBrowserWidget,
        DECORATOR_ID = 'IPythonDecoratorPartBrowserWidget';

    IPythonDecoratorPartBrowserWidget = function (options) {
        var opts = _.extend({}, options);

        ModelDecoratorPartBrowserWidget.apply(this, [opts]);

        this.logger.debug('IPythonDecoratorPartBrowserWidget ctor');
    };

    _.extend(IPythonDecoratorPartBrowserWidget.prototype, ModelDecoratorPartBrowserWidget.prototype);
    IPythonDecoratorPartBrowserWidget.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    IPythonDecoratorPartBrowserWidget.prototype.beforeAppend = function () {
        ModelDecoratorPartBrowserWidget.prototype.beforeAppend.apply(this, arguments);
    };

    IPythonDecoratorPartBrowserWidget.prototype.afterAppend = function () {
        ModelDecoratorPartBrowserWidget.prototype.afterAppend.apply(this, arguments);
    };

    IPythonDecoratorPartBrowserWidget.prototype.update = function () {
        ModelDecoratorPartBrowserWidget.prototype.update.apply(this, arguments);
    };

    return IPythonDecoratorPartBrowserWidget;
});