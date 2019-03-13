/*globals define, _*/
/*jshint browser: true, camelcase: false*/
/**
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/IPythonDecorator.DiagramDesignerWidget',
    './PartBrowser/IPythonDecorator.PartBrowserWidget'
], function (DecoratorBase, IPythonDecoratorDiagramDesignerWidget, IPythonDecoratorPartBrowserWidget) {

    'use strict';

    var IPythonDecorator,
        DECORATOR_ID = 'IPythonDecorator';

    IPythonDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        DecoratorBase.apply(this, [opts]);

        this.logger.debug('IPythonDecorator ctor');
    };

    _.extend(IPythonDecorator.prototype, DecoratorBase.prototype);
    IPythonDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    IPythonDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            DiagramDesigner: IPythonDecoratorDiagramDesignerWidget,
            PartBrowser: IPythonDecoratorPartBrowserWidget
        };
    };

    return IPythonDecorator;
});