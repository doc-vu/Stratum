/*globals define, _*/
/*jshint browser: true, camelcase: false*/
/**
 * This decorator inherits from the ModelDecorator.DiagramDesignerWidget.
 * With no changes to the methods - it will functions just like the ModelDecorator.
 *
 * For more methods see the ModelDecorator.DiagramDesignerWidget.js in the webgme repository.
 *
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'js/RegistryKeys',
    'js/Constants',
    'decorators/ModelDecorator/DiagramDesigner/ModelDecorator.DiagramDesignerWidget',
    'jquery',
    'underscore'
], function (
    REGISTRY_KEYS,
    CONSTANTS,
    ModelDecoratorDiagramDesignerWidget) {

    'use strict';

    var linearRegDecorator,
        DECORATOR_ID = 'linearRegDecorator';

    linearRegDecorator = function (options) {
        var opts = _.extend({}, options);

        ModelDecoratorDiagramDesignerWidget.apply(this, [opts]);

        this.logger.debug('linearRegDecorator ctor');
        this.$resultIndicator = $('<span>',{
            text: "WILL INDICATE RESULT"
        });
        this.$runPluginBtn = $('<button>', {
            type: 'button',
            class: 'btn btn-primary',
            text: 'Run Plugin'
        });

    };


    linearRegDecorator.prototype = Object.create(ModelDecoratorDiagramDesignerWidget.prototype);
    linearRegDecorator.prototype.constructor = linearRegDecorator;
    linearRegDecorator.prototype.DECORATORID = DECORATOR_ID;

    linearRegDecorator.prototype.on_addTo = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        this.logger.debug('This node was added to the canvas', nodeObj);

        // Call the base-class method..
        ModelDecoratorDiagramDesignerWidget.prototype.on_addTo.apply(this, arguments);
        this.$el.append(this.$resultIndicator);
        this.$el.append(this.$runPluginBtn);
        this._checkForResult(client,nodeObj);
    };

    linearRegDecorator.prototype.destroy = function () {
        ModelDecoratorDiagramDesignerWidget.prototype.destroy.apply(this, arguments);
    };

    linearRegDecorator.prototype.update = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        this.logger.debug('This node is on the canvas and received an update event', nodeObj);

        ModelDecoratorDiagramDesignerWidget.prototype.update.apply(this, arguments);
        this._checkForResult(client,nodeObj);
    };

    linearRegDecorator.prototype._checkForResult = function (client, nodeObj) {
        var self = this,
            assetHash = nodeObj.getAttribute('simulator');

        if (assetHash){
            this.$runPluginBtn.css('display', 'none');
            this.$resultIndicator.text("Has Code");
        }
        else {
            this.$runPluginBtn.css('display', 'inline-block');
            this.$resultIndicator.text("");
            this.$runPluginBtn.on('click',function () {
               var pluginContext = client.getCurrentPluginContext(
                   'codeGenerator', nodeObj.getId());

               self.logger.debug('pluginContext', pluginContext);
               client.runBrowserPlugin('codeGenerator', pluginContext, function(err, result){
                   if (err){
                        self.logger.error(err);
                   }
                   else{
                       self.logger.info('Plugin Done', result);
                   }
               });
            });
        }
    };

    return linearRegDecorator;
});