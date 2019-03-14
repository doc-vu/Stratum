define(['js/util',
        '../Libs/CodeMirror/lib/codemirror',
        '../Libs/CodeMirror/mode/python/python',
        'text!./IPythonDialog.html',
        'css!../Libs/CodeMirror/lib/codemirror.css'],
    function(Util,
             CodeMirror,
             CodeMirrorModePython,
             IPythonDialogTemplate){
        'use strict';



        /**
         * DocumentEditorDialog Constructor
         * Insert dialog modal into body and initialize editor with
         * customized options
         */
        var IPythonDialog = function () {
            // Get Modal Template node for Editor Dialog and append it to body
            this._dialog = $(IPythonDialogTemplate);
            this._dialog.appendTo($(document.body));

            // Get element nodes
            this._btnSave = this._dialog.find('.btn-save').first();
            this._title = this._dialog.find('.modal-header').first();
            this._codearea = this._dialog.find('#codearea').first();

            //this.logger.debug('IPythonDialog was added to the canvas');

            // /* Create CodeMirror Editor with options */
            var codemirrorEditorOptions = {
                lineNumbers: true,
                viewPortMargin: Infinity,
                gutters: ['CodeMirror-linenumbers'],
                path: 'decorators/Libs/CodeMirror/lib/',
                mode: {
                    name: "python",
                    version: 2,
                    singleLineStringErrors: false,
                    indentUnit: 4,
                    matchBrackets: true
                }
            };
            this.editor = CodeMirror.fromTextArea(
                this._codearea.get(0),
                codemirrorEditorOptions);
            this.editor.setSize(null, 150);
            this.text = ''; // Keep track modified text in editor
            // debugger;
        };


            /**
             * Initialize CodeEditorDialog by creating EpicEditor in Bootstrap modal
             * window and set event listeners on its subcomponents like save button. Notice
             * EpicEditor is created but not loaded yet. The creation and loading of editor
             * are seperated due to the reason decorator component is not appended to DOM within
             * its own domain.
             * @param  {String}     text           Text to be rendered in editor initially
             * @param  {Function}   saveCallback   Callback function after click save button
             * @return {void}
             */

            IPythonDialog.prototype._initialize = function (title, text, saveCallback) {

                //debugger;
                //alert('It works');
                var self = this;
                this.text = text; // Initial text from Attribute documentation

                // Initialize Modal and append it to main DOM
                this._dialog.modal({show: false});

                // Initialize the title
                this._title.find('#title').text(title);

                // Event listener on click for SAVE button
                this._btnSave.on('click', function (event) {
                    // Invoke callback to deal with modified text, like save it in client.
                    if (saveCallback) {
                        saveCallback.call(null, self.editor.getValue());
                    }

                    // Close dialog
                    self._dialog.modal('hide');
                    event.stopPropagation();
                    event.preventDefault();
                });

                // Listener on event when dialog is shown
                // Use callback to show editor after Modal window is shown.
                this._dialog.on('shown.bs.modal', function () {
                    self.editor.setValue(self.text);
                    self.editor.refresh();
                });

                // Listener on event when dialog is hidden
                this._dialog.on('hidden.bs.modal', function () {
                    self._dialog.empty();
                    self._dialog.remove();
                });
            };

            /**
             * Update text in editor area
             * @param  {String} newtext [new text to replace old one]
             */
            IPythonDialog.prototype.updateText = function (newtext) {
                this.text = newtext;
            };

            /**
             * Show actual text editor in its container by loading EpicEditor, this method
             * must be put into listener's callback function because its container is not appended
             * into DOM at this point and load() cannot access other DOM elements.
             * @return {void}
             */
            IPythonDialog.prototype.show = function () {

                //alert(1);
                var self = this;
                self._dialog.modal('show');
            };

            return IPythonDialog;

        }
        );