/*globals define, _*/
/*jshint browser: true, camelcase: false*/
/**
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/linearRegDecorator.DiagramDesignerWidget',
    './PartBrowser/linearRegDecorator.PartBrowserWidget'
], function (DecoratorBase, linearRegDecoratorDiagramDesignerWidget, linearRegDecoratorPartBrowserWidget) {

    'use strict';

    var linearRegDecorator,
        DECORATOR_ID = 'linearRegDecorator';

    linearRegDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        DecoratorBase.apply(this, [opts]);

        this.logger.debug('linearRegDecorator ctor');
    };

    _.extend(linearRegDecorator.prototype, DecoratorBase.prototype);
    linearRegDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    linearRegDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            DiagramDesigner: linearRegDecoratorDiagramDesignerWidget,
            PartBrowser: linearRegDecoratorPartBrowserWidget
        };
    };

    return linearRegDecorator;
});