/*globals define, WebGMEGlobal, $ */
define([
    'lib/jquery/' + (DEBUG ? 'jquery.layout' : 'jquery.layout.min'),
    'js/logger',
    'js/Utils/ComponentSettings',
    'text!./templates/CHFLayout.html',
    'text!./CHFLayoutConfig.json'
], function(
    _jQueryLayout,
    Logger,
    ComponentSettings,
    defaultLayoutTemplate,
    LayoutConfigJSON
) {
    'use strict';
    
    var DEFAULT_CONFIG = JSON.parse(LayoutConfigJSON);
    var CHFLayout = function(params) {
        this._logger = (params && params.logger) || Logger.create('gme:Layouts:CHFLayout',
            WebGMEGlobal.gmeConfig.client.log);

        this.config = this.config ||
            WebGMEGlobal.componentSettings[this.getComponentId()] ||
            DEFAULT_CONFIG;

        this.panels = this.config.panels;
        this._template = (params && params.template) || defaultLayoutTemplate;

        this._body = null;
        this._panelToContainer = {};
    };

    /**
     * Initialize the html page. This example is using the jQuery Layout plugin.
     *
     * @return {undefined}
     */
    CHFLayout.prototype.init = function() {
        var self = this;

        this._body = $('body');
        this._body.html(this._template);

        this._centerPanel = this._body.find('div.center');
        this._floatContainer = this._body.find('div.float');

        this._headerPanel = this._body.find('div.ui-layout-north');
        this._footerPanel = this._body.find('div.ui-layout-south');

        this._canvas = null;
        this._body.layout({
            north: {
                closable: false,
                resizable: false,
                slidable: false,
                spacing_open: 0, //jshint ignore: line
                size: 64
            },
            south: {
                closable: false,
                resizable: false,
                slidable: false,
                spacing_open: 0, //jshint ignore: line
                size: 27        //has to match footer CSS settings (height + border)
            },
            center: {
                onresize: function (/*paneName, paneElement, paneState, paneOptions, layoutName*/) {
                    self._onCenterResize();
                }
            }
        });
    };

    CHFLayout.prototype.getComponentId = function() {
        return 'CHFLayout';
    };

    /**
     * Add a panel to a given container. This is defined in the corresponding
     * layout config JSON file.
     *
     * @param {Panel} panel
     * @param {String} container
     * @return {undefined}
     */
    CHFLayout.prototype.addToContainer = function(panel, container) {
        if (container === 'header') {
            this._headerPanel.append(panel.$pEl);
        } else if (container === 'footer') {
            this._footerPanel.append(panel.$pEl);
        } else if (container === 'float') {
            this._floatContainer.append(panel.$pEl);
        } else if (container === 'center') {
            this._centerPanel.append(panel.$pEl);
            this._canvas = panel;
            this._onCenterResize();
            return this._onCenterResize;
        }
    };

    /**
     * Remove the given panel from the views
     *
     * @param {Panel} panel
     * @return {undefined}
     */
    CHFLayout.prototype.remove = function(panel) {
        if (this._canvas === panel) {
            this._centerPanel.empty();
        }
    };

    /**
     * Remove the current layout
     *
     * @return {undefined}
     */
    CHFLayout.prototype.destroy = function() {
        this._body.empty();
    };

    // Resize handlers
    //
    // These are internally called and used by the example to provide a responsive
    // UI (even if it is simply scaling linearly here)
    CHFLayout.prototype._onCenterResize = function() {
        if (this._canvas) {
            this._canvas.setSize(this._centerPanel.width(), this._centerPanel.height());
        }
    };

    return CHFLayout;
});
