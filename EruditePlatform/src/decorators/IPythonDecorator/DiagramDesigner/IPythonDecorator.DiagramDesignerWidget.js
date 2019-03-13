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
    './IPythonDialog',
    'decorators/ModelDecorator/DiagramDesigner/ModelDecorator.DiagramDesignerWidget',
    'jquery',
    'underscore'
    ], function (
    REGISTRY_KEYS,
    CONSTANTS,
    IPythonDialog,
    ModelDecoratorDiagramDesignerWidget
    ) {

    'use strict';

    var IPythonDecorator,
        DECORATOR_ID = 'IPythonDecorator',
        EQN_EDIT_BTN_BASE = $('<i class="glyphicon glyphicon-edit text-meta"/>');

    IPythonDecorator = function (options) {
        var opts = _.extend({}, options);
        this._skinParts = {};

        ModelDecoratorDiagramDesignerWidget.apply(this, [opts]);

        this.logger.debug('IPythonDecorator ctor');

        //this.$editBtn = EQN_EDIT_BTN_BASE;
        // this.$runPluginBtn = $('<button>', {
        //     type: 'button',
        //     class: 'btn btn-danger',
        //     text: 'IPython'
        // });

    };

    IPythonDecorator.prototype = Object.create(ModelDecoratorDiagramDesignerWidget.prototype);
    IPythonDecorator.prototype.constructor = IPythonDecorator;
    IPythonDecorator.prototype.DECORATORID = DECORATOR_ID;
   // IPythonDecorator.prototype.IPythonDialog = IPythonDialog;

    //_.extend(IPythonDecorator.prototype, IPythonDialog.prototype);

    /*********************** OVERRIDE ModelDecoratorDiagramDesignerWidget MEMBERS **************************/

    IPythonDecorator.prototype.on_addTo = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        this.logger.debug('This node was added to the canvas', nodeObj);

        // Call the base-class method..
        ModelDecoratorDiagramDesignerWidget.prototype.on_addTo.apply(this, arguments);
        this.$el.append('<br>');
        this._skinParts.$EqnEditorBtn = EQN_EDIT_BTN_BASE.clone();
        this.$el.append(this._skinParts.$EqnEditorBtn);
        this.$el.append('  Function');
        this.$el.append('<br>');
         this.$el.append(this.$runPluginBtn);
         this.$el.append('<br>');
         this._checkForResult(client,nodeObj);
    };

    IPythonDecorator.prototype.destroy = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);
        ModelDecoratorDiagramDesignerWidget.prototype.destroy.apply(this, arguments);
    };

    // IPythonDecorator.prototype.update = function () {
    //     var client = this._control._client,
    //         nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);
    //
    //     this.logger.debug('This node is on the canvas and received an update event', nodeObj);
    //
    //     ModelDecoratorDiagramDesignerWidget.prototype.update.apply(this, arguments);
    //     this._checkForResult(client,nodeObj);
    // };

    IPythonDecorator.prototype._checkForResult = function (client, nodeObj) {
        var self = this;
        //this.$runPluginBtn.css('display', 'inline-block');
        //this.$runPluginBtn.on('click',function () {
          //  window.location.href = "http://129.59.234.224:7070/?project=anirban%2Berudite&branch=master&node=%2F8&visualizer=MLSimulator&tab=0&layout=DefaultLayout&selection=%2F8%2FQ";
        //});
        this._skinParts.$EqnEditorBtn.on('click', function () {
            //if (self.hostDesignerItem.canvas.getIsReadOnlyMode() !== true &&
              //  nodeObj.getAttribute('OutputFunction') !== undefined) {
            self._showEditorDialog('codeEditor');
            //}

            event.stopPropagation();
            event.preventDefault();
        });
    };

    IPythonDecorator.prototype._showEditorDialog = function (attrName) {

        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            attrText = nodeObj.getAttribute(attrName),
            title = '<title>';

        //debugger;
        var nodeName = nodeObj.getAttribute('name');

//debugger;
        var editorDialog = new IPythonDialog();

        this.logger.debug('This node is on the canvas and received an update event', IPythonDialog);
        if (attrName === 'codeEditor') {
            title = 'Input-output relation (business logic) for ' + nodeName + ' component';
        }


        //Initialize with CodeEditor attribute and save callback function

        editorDialog._initialize(title, attrText, function (text) {
            try {
                client.setAttributes(self._metaInfo[CONSTANTS.GME_ID], attrName, text);
            } catch (e) {
                self.logger.error('Saving META failed... Either not JSON object or something else went wrong...');
            }
        });

        editorDialog.show();
    };

    return IPythonDecorator;
});