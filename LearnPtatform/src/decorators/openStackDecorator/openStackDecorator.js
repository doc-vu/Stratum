/*globals define, _*/
/*jshint browser: true, camelcase: false*/
/**
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/openStackDecorator.DiagramDesignerWidget',
    './PartBrowser/openStackDecorator.PartBrowserWidget'
], function (DecoratorBase, openStackDecoratorDiagramDesignerWidget, openStackDecoratorPartBrowserWidget) {

    'use strict';

    var openStackDecorator,
        DECORATOR_ID = 'openStackDecorator';

    openStackDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        DecoratorBase.apply(this, [opts]);

        this.logger.debug('openStackDecorator ctor');
    };

    _.extend(openStackDecorator.prototype, DecoratorBase.prototype);
    openStackDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    openStackDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            DiagramDesigner: openStackDecoratorDiagramDesignerWidget,
            PartBrowser: openStackDecoratorPartBrowserWidget
        };
    };

    return openStackDecorator;
});