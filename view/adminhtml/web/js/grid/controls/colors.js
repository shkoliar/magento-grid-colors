/**
 * GridColors
 *
 * @copyright Copyright © 2020 Dmitry Shkoliar. All rights reserved.
 * @author    Dmitry Shkoliar
 * @website   shkoliar.com
 */

/**
 * @api
 */
define([
    'underscore',
    'uiLayout',
    'mageUtils',
    'mage/translate',
    'uiCollection'
], function (_, layout, utils, $t, Collection) {
    'use strict';

    /**
     * @param {Object} data
     * @returns {Object}
     */
    function removeEmpty(data) {
        var result = utils.mapRecursive(data, function (value) {
            return _.isString(value) ? value.trim() : value;
        });

        return utils.mapRecursive(result, utils.removeEmptyValues.bind(utils));
    }

    return Collection.extend({
        defaults: {
            _processed: [],
            _processedCount: 1,
            template: 'Shkoliar_GridColors/grid/controls/colors',
            displayArea: 'dataGridActions',
            columnsProvider: 'ns = ${ $.ns }, componentType = columns',
            bookmarksProvider: 'ns = ${ $.ns }, componentType = bookmark',
            columnsComponentProvider:  'ns = ${ $.ns }, index = columns',
            storageConfig: {
                namespace: 'current',
                provider: 'ns = ${ $.ns }, index = bookmarks'
            },
            grid_color_type: '',
            grid_color_colors: {},
            grid_color: {
                type: '',
                colors: {}
            },
            statefull: {
                grid_color_type: true,
                grid_color_colors: true
            },
            templates: {
                base: {
                    parent: '${ $.$data.parentComponent.name }',
                    provider: '${ $.$data.parentComponent.name }',
                    links: {
                        value: '${ $.provider }:${ $.dataScope }'
                    }
                },
                select: {
                    component: 'Magento_Ui/js/form/element/select',
                    template: 'ui/grid/filters/field',
                    dataScope: 'grid_color_type',
                    name: '${ $.dataScope }.select',
                    options: '${ JSON.stringify($.$data.options) }',
                    label: $t('Colorize by'),
                    caption: ' '
                },
                colorPicker: {
                    component: 'Magento_Ui/js/form/element/color-picker',
                    template: 'ui/grid/filters/field',
                    elementTmpl: 'ui/form/element/color-picker',
                    dataScope: 'grid_color_colors.${ $.$data.column.index }.${ $.$data.option.value }',
                    nameScope: '${ $.$data.column.index }',
                    name: '${ $.dataScope }.colorPicker',
                    label: '${ $.$data.option.label }',
                    colorPickerConfig: {
                        allowEmpty: true,
                        clickoutFiresChange: true,
                        showAlpha: false,
                        showButtons: true,
                        showInput: true,
                        showPalette: true,
                        showSelectionPalette: true,
                        preferredFormat: 'hex'
                    },
                    visible: false,
                    imports: {
                        setVisibility: '${ $.provider }:grid_color_type'
                    },
                    setVisibility: function (type) {
                        if (this.value() === undefined) {
                            this.value('');
                        }

                        this.visible(type === this.nameScope);
                    },
                }
            },
            imports: {
                processColumns: '${ $.columnsProvider }:elems',
                bookmarksActiveIndex: '${ $.bookmarksProvider }:activeIndex'
            },
            listens: {
                grid_color_type: 'updateType',
                grid_color_colors: 'updateColors'
            },
            exports: {
                grid_color: '${ $.columnsProvider }:grid_color'
            },
            modules: {
                columns: '${ $.columnsProvider }'
            }
        },

        /**
         * @returns {Object}
         */
        initObservable: function () {
            this._super()
                .track({
                    grid_color: {}
                });

            return this;
        },

        /**
         * @returns {Object}
         */
        cancel: function () {
            this.applyState('');

            return this;
        },

        /**
         * @returns {Object}
         */
        reset: function () {
            this.applyState('default');

            return this;
        },

        /**
         * @param {String} type
         * @returns {Object}
         */
        updateType: function (type) {
            this.grid_color = {
                type: type,
                colors: this.grid_color_colors
            };

            return this;
        },

        /**
         * @param {Object} colors
         * @returns {Object}
         */
        updateColors: function (colors) {
            colors = removeEmpty(colors);

            this.grid_color = {
                type: this.grid_color_type,
                colors: colors
            };

            this.grid_color_colors = colors;

            return this.ifNeedsApplyState(this.grid_color_colors);
        },

        /**
         * @param {Object} color
         * @returns {Object}
         */
        ifNeedsApplyState(color) {
            var size = 0;

            _.each(color, function (color) {
                size += _.size(color);
            }, this);

            if (this._processedCount === this._processed.length - size - 1) {
                this._processedCount = this._processed.length;
                this.applyState(this.bookmarksActiveIndex);
            } else if (this._processedCount < this._processed.length) {
                this._processedCount++;
            }

            return this;
        },

        /**
         * @param {Object} color
         * @returns {Boolean}
         */
        isColorVisible: function (color) {
            return color.visible();
        },

        /**
         * @returns {Boolean}
         */
        hasColorsVisible: function () {
            return _.some(this.getColors(), this.isColorVisible, this);
        },

        /**
         * @param {Object} elem
         * @returns {Boolean}
         */
        isColor: function (elem) {
            return elem.component === 'Magento_Ui/js/form/element/color-picker';
        },

        /**
         * @returns {Boolean}
         */
        hasColors: function () {
            return this.elems.some(this.isColor, this);
        },

        /**
         *
         * @param {Array} columns
         * @returns {Object}
         */
        setColors: function(columns) {
            var processed = this._processed;

            _.each(columns, function (column) {
                var index = column.index;

                _.each(column.options, function (option) {
                    var value = option.value,
                        key = [index, value].join('.');

                    if (_.contains(processed, key)) {
                        return;
                    }

                    processed.push(key);

                    layout([this.buildColor(option, column)]);
                }, this);

            }, this);

            return this;
        },

        /**
         *
         * @returns {Array}
         */
        getColors: function () {
            return this.elems.filter(this.isColor);
        },

        /**
         * @param {Array} columns
         * @returns {Object}
         */
        setSelect: function(columns) {
            var processed = this._processed,
                key = 'type';

            if (_.contains(processed, key)) {
                return this;
            }

            processed.push(key);

            layout([this.buildSelect(columns)]);

            return this;
        },

        /**
         * @returns {Array}
         */
        getSelect: function () {
            return this.elems.filter(function (elem) {
                return elem.component === 'Magento_Ui/js/form/element/select';
            });
        },

        /**
         * @param {Array} columns
         * @returns {Object}
         */
        buildSelect: function (columns) {
            var options = _.map(columns, function(column) {
                return {
                    value: column.index.toString(),
                    label: column.label
                }
            }, this);

            var select = utils.extend({}, this.templates.base, this.templates.select);

            select = utils.template(select, {
                parentComponent: this,
                options: options
            }, true, true);

            return select;
        },

        /**
         * @param {Option} option
         * @param {Column} column
         * @returns {Object}
         */
        buildColor: function (option, column) {
            var color = utils.extend({}, this.templates.base, this.templates.colorPicker);

            color = utils.template(color, {
                parentComponent: this,
                column: column,
                option: option
            }, true, true);

            return color;
        },

        /**
         * @param {Array} columns
         * @returns {Object}
         */
        processColumns: function (columns) {
            columns = _.where(columns, {
                controlVisibility: true,
                componentType: 'column.select'
            });

            this.setSelect(columns)
                .setColors(columns);

            return this;
        },

        /**
         * @param {String} state
         * @returns {Object}
         */
        applyState: function (state) {
            this.storage('applyStateOf', state, this.storageConfig.namespace);

            return this;
        }
    });
});
