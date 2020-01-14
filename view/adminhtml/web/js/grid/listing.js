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
define([], function () {
    'use strict';

    return function (Listing) {
        return Listing.extend({
            defaults: {
                template: 'Shkoliar_GridColors/grid/listing',
                row_colors_type: '',
                row_colors: [],
                grid_color: {
                    type: '',
                    colors: {}
                },
                listens: {
                    rows: 'updatedRows',
                    grid_color: 'updateColors'
                }
            },

            /**
             * @returns {Object}
             */
            initObservable: function () {
                this._super()
                    .track({
                        row_colors_type: '',
                        row_colors: [],
                    });

                return this;
            },

            /**
             * @returns {Object}
             */
            updatedRows: function() {
                this.updateColors(this.grid_color);

                return this;
            },

            /**
             * @param {Object} grid_color
             * @returns {Object}
             */
            updateColors: function(grid_color) {
                if (this.rows.length > 0) {
                    var colors = grid_color.colors ? grid_color.colors[grid_color.type] || {} : {},
                        key = '',
                        row_colors = [];

                    _.each(this.rows, function (row) {
                        key = row[grid_color.type] || '';

                        if (key.toString().length > 0) {
                            row_colors.push(colors[key]);
                        } else {
                            row_colors.push('');
                        }
                    });

                    this.row_colors_type = grid_color.type;
                    this.row_colors = row_colors;
                }

                return this;
            },

            /**
             * @param {Object} row
             * @returns {String}
             */
            getRowColor: function(row) {
                return this.row_colors[row._rowIndex];
            }

        });
    }
});