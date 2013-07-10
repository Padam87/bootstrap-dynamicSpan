;(function($) {
    $.dynamicSpan = function(el, options) {
        var defaults = {
            equalizeHeights: true,
            beforeEqualizeHeights: function() {
            }
        };

        var dynamicSpan = this;

        dynamicSpan.settings = {};

        var init = function() {
            dynamicSpan.settings = $.extend({}, defaults, options);

            dynamicSpan.resizeRow(el);
            $(window).resize(function() {
                dynamicSpan.resizeRow(el);
            });
        };

        dynamicSpan.resizeRow = function(row) {
            $(row).each(function() {
                var $row = $(this);
                var rowW = $row.width();

                var sumW = 0;
                var previousCols = [];

                $row.find('> div.span-dynamic').each(function() {
                    var $col = $(this);
                    $col.css('width', 'auto');

                    var colW = $col.outerWidth(true);

                    if ((sumW + colW > rowW)) {
                        dynamicSpan.resizeCols(previousCols, rowW, sumW);

                        sumW = 0;
                        previousCols = [];
                    }

                    previousCols.push($col);
                    sumW += colW;

                    if ($col.is(":last-of-type")) {
                        dynamicSpan.resizeCols(previousCols, rowW, sumW);
                    }
                });
            });
        };

        dynamicSpan.resizeCols = function(cols, rowW, sumW) {
            var count = $(cols).size();
            var add = Math.floor((rowW - sumW) / count);

            $(cols).each(function() {
                $(this).width($(this).width() + add);
            });

            if (dynamicSpan.settings.equalizeHeights) {
                dynamicSpan.settings.beforeEqualizeHeights();

                var maxH = 0;

                $(cols).each(function() {
                    if ($(this).height() > maxH) {
                        maxH = $(this).height();
                    }
                });

                $(cols).each(function() {
                    $(this).height(maxH);
                });
            }
        };

        init();
    };

    $.fn.dynamicSpan = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('dynamicSpan')) {
                var dynamicSpan = new $.dynamicSpan(this, options);
                $(this).data('dynamicSpan', dynamicSpan);
            }
        });
    };

})(jQuery);