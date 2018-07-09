/*------------------------------------------------------------------------
 # MD Slider - March 18, 2013
 # ------------------------------------------------------------------------
 # Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
 --------------------------------------------------------------------------*/

(function ($) {
    var effectsIn = [
        'bounceIn',
        'bounceInDown',
        'bounceInUp',
        'bounceInLeft',
        'bounceInRight',
        'fadeIn',
        'fadeInUp',
        'fadeInDown',
        'fadeInLeft',
        'fadeInRight',
        'fadeInUpBig',
        'fadeInDownBig',
        'fadeInLeftBig',
        'fadeInRightBig',
        'flipInX',
        'flipInY',
        'foolishIn', //-
        'lightSpeedIn',
        'rollIn',
        'rotateIn',
        'rotateInDownLeft',
        'rotateInDownRight',
        'rotateInUpLeft',
        'rotateInUpRight',
        'twisterInDown', //-
        'twisterInUp', //-
        'swap', //-
        'swashIn',  //-
        'tinRightIn',  //-
        'tinLeftIn',  //-
        'tinUpIn',  //-
        'tinDownIn', //-
    ],
    effectsOut = [
        'bombRightOut',  //-
        'bombLeftOut', //-
        'bounceOut',
        'bounceOutDown',
        'bounceOutUp',
        'bounceOutLeft',
        'bounceOutRight',
        'fadeOut',
        'fadeOutUp',
        'fadeOutDown',
        'fadeOutLeft',
        'fadeOutRight',
        'fadeOutUpBig',
        'fadeOutDownBig',
        'fadeOutLeftBig',
        'fadeOutRightBig',
        'flipOutX',
        'flipOutY',
        'foolishOut', //-
        'hinge',
        'holeOut', //-
        'lightSpeedOut',
        'puffOut',  //-
        'rollOut',
        'rotateOut',
        'rotateOutDownLeft',
        'rotateOutDownRight',
        'rotateOutUpLeft',
        'rotateOutUpRight',
        'rotateDown', //-
        'rotateUp', //-
        'rotateLeft', //-
        'rotateRight', //-
        'swashOut', //-
        'tinRightOut', //-
        'tinLeftOut', //-
        'tinUpOut', //-
        'tinDownOut', //-
        'vanishOut' //-
    ];
    var e_in_length = effectsIn.length,
        e_out_length = effectsOut.length;
    var MDSlider = function ($element, options) {
        var defaults = {
            className: 'md-slide-wrap',
            itemClassName: 'md-slide-item',
            transitions: 'strip-down-left', // name of transition effect (fade, scrollLeft, scrollRight, scrollHorz, scrollUp, scrollDown, scrollVert)
            transitionsSpeed: 800, // speed of the transition (millisecond)
            width: 990, // responsive = false: this appear as container width; responsive = true: use for scale ;fullwidth = true: this is effect zone width
            height: 420, // container height
            responsive: true,
            fullwidth: true,
            styleBorder: 0, // Border style, from 1 - 9, 0 to disable
            styleShadow: 0, // Dropshadow style, from 1 - 5, 0 to disable
            posBullet: 2, // Bullet position, from 1 to 6, default is 5
            posThumb: 1, // Thumbnail position, from 1 to 5, default is 1
            stripCols: 20,
            stripRows: 10,
            slideShowDelay: 6000, // stop time for each slide item (millisecond)
            slideShow: true,
            loop: false,
            pauseOnHover: false,
            showLoading: true, // Show/hide loading bar
            loadingPosition: 'bottom', // choose your loading bar position (top, bottom)
            showArrow: true, // show/hide next, previous arrows
            showBullet: true,
            videoBox: false,
            showThumb: true, // Show thumbnail, if showBullet = true and showThumb = true, thumbnail will be shown when you hover bullet navigation
            enableDrag: true, // Enable mouse drag
            touchSensitive: 50,
            onEndTransition: function () {
            },	//this callback is invoked when the transition effect ends
            onStartTransition: function () {
            }	//this callback is invoked when the transition effect starts
        };
        this.slider = $element;
        this.options = $.extend({}, defaults, options);
        this.slideItems = [];
        this.activeIndex = -1;
        this.numItem = 0;
        this.lock = true;
        this.minThumbsLeft = 0;
        this.touchstart = false;
        this.thumbsDrag = false;
        this.slideShowDelay = 0;
        this.play = false;
        this.pause = false;
        this.step = 0;
    
        this.init();
    };
    
    MDSlider.prototype = {
        constructor: MDSlider,

        // init
        init: function() {
            var self = this;
            if ("ActiveXObject" in window)
                $(".md-item-opacity", this.slider).addClass("md-ieopacity");

            this.slider.addClass("loading-image");
            var slideClass = '';
            if (this.options.responsive)
                slideClass += ' md-slide-responsive';
            if (this.options.fullwidth)
                slideClass += ' md-slide-fullwidth';
            if (this.options.showBullet && this.options.posBullet)
                slideClass += ' md-slide-bullet-' + this.options.posBullet;
            if (!this.options.showBullet && this.options.showThumb && this.options.posThumb)
                slideClass += ' md-slide-thumb-' + this.options.posThumb;

            this.slider.wrap('<div class="' + this.options.className + slideClass + '"><div class="md-item-wrap"></div></div>');
            this.hoverDiv = this.slider.parent();
            this.wrap = this.hoverDiv.parent();
            this.slideWidth = this.options.responsive ? this.slider.width() : this.options.width;
            this.slideHeight = this.options.height;
            this.slideItems = [];
            this.hasTouch = this.documentHasTouch();
            if (this.hasTouch)
                this.wrap.addClass("md-touchdevice");
            //
            this.slider.find('.' + this.options.itemClassName).each(function (index) {
                self.numItem++;
                self.slideItems[index] = $(this);
                $(this).find(".md-object").each(function () {
                    var top = $(this).data("y") ? $(this).data("y") : 0,
                        left = $(this).data("x") ? $(this).data("x") : 0,
                        width = $(this).data("width") ? $(this).data("width") : 0,
                        height = $(this).data("height") ? $(this).data("height") : 0;
                    if (width > 0) {
                        $(this).width((width / self.options.width * 100) + "%");
                    }
                    if (height > 0) {
                        $(this).height((height / self.options.height * 100) + "%");
                    }
                    var css = {
                        top: (top / self.options.height * 100) + "%",
                        left: (left / self.options.width * 100) + "%"
                    };
                    $(this).css(css);
                });
                if (index > 0)
                    $(this).hide();
            });
            this.initControl();
            this.initDrag();
            if (this.options.slideShow) {
                this.play = true;
            }
            $('.md-object', this.slider).hide();
            if ($(".md-video", this.wrap).size() > 0) {
                if (this.options.videoBox) {
                    $(".md-video", this.wrap).mdvideobox({autoplayVideo: self.options.autoplayVideo});
                } else {
                    var videoCtrl = $('<div class="md-video-control" style="display: none"></div>');                    
                    this.wrap.append(videoCtrl);
                    $(".md-video", this.wrap).click(function () {
                        var video_ele = $("<iframe></iframe>");
                        video_ele.attr('allowFullScreen', '').attr('frameborder', '0').css({
                            width: "100%",
                            height: "100%",
                            background: "black"
                        });
                        if(self.options.autoplayVideo)
                            video_ele.attr("src", $(this).attr("href") + "?autoplay=1");
                        else
                            video_ele.attr("src", $(this).attr("href"));
                        var closeButton = $('<a href="#" class="md-close-video" title="Close video"></a>');
                        closeButton.click(function () {
                            videoCtrl.html("").hide();
                            self.play = true;
                            return false;
                        });
                        videoCtrl.html("").append(video_ele).append(closeButton).show();
                        
                        if(self.arrowButton){
                            videoCtrl.append('<div class="md-arrow"><div class="md-arrow-left"><span></span></div><div class="md-arrow-right"><span></span></div></div>');
                            $('.md-arrow-right', videoCtrl).bind('click', function () {
                                closeButton.trigger('click');
                                self.slideNext();
                            });
                            $('.md-arrow-left', videoCtrl).bind('click', function () {
                                closeButton.trigger('click');
                                self.slidePrev();
                            });
                        }
                        
                        self.play = false;
                        return false;
                    });
                }
            }
            $(window).resize(function () {
                self.resizeWindow();
            }).trigger("resize");
            this.preloadImages();
            this.removeLoader();

            // process when un-active tab
            var inActiveTime = false;
            $(window).blur(function () {
                inActiveTime = (new Date()).getTime();
            });
            $(window).focus(function () {
                if (inActiveTime) {
                    var duration = (new Date()).getTime() - inActiveTime;

                    if (duration > self.slideShowDelay - self.step)
                        self.step = self.slideShowDelay - 200;
                    else
                        self.step += duration;
                    inActiveTime = false;
                }
            });

            $(window).trigger('scroll');
        },

        initControl: function() {
            var self = this;
            // Loading bar
            if (this.options.slideShow && this.options.showLoading) {
                var loadingDiv = $('<div class="loading-bar-hoz loading-bar-' + this.options.loadingPosition + '"><div class="br-timer-glow" style="left: -100px;"></div><div class="br-timer-bar" style="width:0px"></div></div>');
                this.wrap.append(loadingDiv);
                this.loadingBar = $(".br-timer-bar", loadingDiv);
                this.timerGlow = $(".br-timer-glow", loadingDiv);
            }
            if (this.options.slideShow && this.options.pauseOnHover) {
                this.hoverDiv.hover(function () {
                    self.pause = true;
                }, function () {
                    self.pause = false;
                });
            }
            // Border
            if (this.options.styleBorder != 0) {
                var borderDivs = '<div class="border-top border-style-' + this.options.styleBorder + '"></div>';
                borderDivs += '<div class="border-bottom border-style-' + this.options.styleBorder + '"></div>';
                if (!this.options.fullwidth) {
                    borderDivs += '<div class="border-left border-style-' + this.options.styleBorder + '"><div class="edge-top"></div><div class="edge-bottom"></div></div>';
                    borderDivs += '<div class="border-right border-style-' + this.options.styleBorder + '"><div class="edge-top"></div><div class="edge-bottom"></div></div>';
                }
                this.wrap.append(borderDivs);
            }
            // Shadow
            if (this.options.styleShadow != 0) {
                var shadowDivs = '<div class="md-shadow md-shadow-style-' + this.options.styleShadow + '"></div>';
            }
            // Next, preview arrow
            if (this.options.showArrow) {
                this.arrowButton = $('<div class="md-arrow"><div class="md-arrow-left"><span></span></div><div class="md-arrow-right"><span></span></div></div>');
                this.hoverDiv.append(this.arrowButton);
                $('.md-arrow-right', this.arrowButton).bind('click', function () {
                    self.slideNext();
                });
                $('.md-arrow-left', this.arrowButton).bind('click', function () {
                    self.slidePrev();
                });
            }
            ;
            if (this.options.showBullet != false || this.options.showNavigationLinks != false) {
                this.buttons = $('<div class="md-bullets"></div>');
                if(this.options.showNavigationLinks){
                    this.buttons.addClass('md-navigation-links');
                }
                this.wrap.append(this.buttons);
                for (var i = 0; i < this.numItem; i++) {
                    var tagLink = '<a></a>';
                    if(this.options.showNavigationLinks){
                        tagLink = '<a href="#">' + this.slideItems[i].data("thumb-alt") + '</a>'
                    }
                    this.buttons.append('<div class="md-bullet"  rel="' + i + '">' + tagLink + '</div>');
                }
                ;
                if (this.options.showThumb) {
                    var thumbW = parseInt(this.slider.data("thumb-width")),
                        thumbH = parseInt(this.slider.data("thumb-height"));
                    for (var i = 0; i < this.numItem; i++) {
                        var thumbSrc = this.slideItems[i].data("thumb"),
                            thumbType = this.slideItems[i].data("thumb-type"),
                            thumbAlt = this.slideItems[i].data("thumb-alt");
                        if (thumbSrc) {
                            var thumb, thumbLeft;
                            if(this.options.showNavigationLinks){
                                var textLinkWidth =  $('div.md-bullet:eq(' + i + ')', this.buttons).outerWidth();
                                if(thumbW > textLinkWidth)
                                    thumbLeft = (thumbW + 6 - textLinkWidth) / 2;
                                else
                                    thumbLeft = 0;
                            } else
                                thumbLeft = thumbW / 2 - 2;
                            
                            if (thumbType == "image")
                                thumb = $('<img />').attr("src", thumbSrc).attr("alt", this.slideItems[i].data("thumb-alt")).css({
                                    top: -(9 + thumbH) + "px",
                                    left: -thumbLeft + "px",
                                    opacity: 0
                                })
                            else
                                thumb = $("<span></span>").attr("style", thumbSrc).css({
                                    top: -(9 + thumbH) + "px",
                                    left: -thumbLeft + "px",
                                    opacity: 0
                                });
                            $('div.md-bullet:eq(' + i + ')', this.buttons).append(thumb).append('<div class="md-thumb-arrow" style="opacity: 0"></div>');
                        }
                    }
                    $('div.md-bullet', this.buttons).hover(function () {
                        $(this).addClass('md_hover');
                        $("img, span", this).show().animate({'opacity': 1}, 200);
                        $('.md-thumb-arrow', this).show().animate({'opacity': 1}, 200);
                    }, function () {
                        $(this).removeClass('md_hover');
                        $('img, span', this).animate({'opacity': 0}, 200, function () {
                            $(this).hide();
                        });
                        $('.md-thumb-arrow', this).animate({'opacity': 0}, 200, function () {
                            $(this).hide();
                        });
                    });
                }
                $('div.md-bullet', this.wrap).click(function (event) {
                    event.preventDefault();
                    if (!$(this).hasClass('md-current')) {
                        var index = $(this).attr('rel');
                        self.slide(index);
                    }
                });
            } else if (this.options.showThumb) {
                var thumbDiv = $('<div class="md-thumb"><div class="md-thumb-container"><div class="md-thumb-items"></div></div></div>').appendTo(this.wrap);
                this.slideThumb = $(".md-thumb-items", thumbDiv);
                for (var i = 0; i < this.numItem; i++) {
                    var thumbSrc = this.slideItems[i].data("thumb"),
                        thumbType = this.slideItems[i].data("thumb-type"),
                        thumbAlt = this.slideItems[i].data("thumb-alt");

                    if (thumbSrc) {
                        var $link = $('<a class="md-thumb-item" />').attr("rel", i);
                        if (thumbType == "image")
                            $link.append($('<img />').attr("src", thumbSrc).attr("alt", this.slideItems[i].data("thumb-alt")))
                        else
                            $link.append($('<span />').attr("style", thumbSrc).css("display", "inline-block"));
                        this.slideThumb.append($link);
                    }
                }
                $("a", this.slideThumb).click(function () {
                    if ($(this).hasClass('md-current') || self.thumbsDrag) {
                        return false;
                    }
                    ;
                    var index = $(this).attr('rel');
                    self.slide(index);
                });
            }
        },

        initDrag: function() {
            var self = this;
            if (this.hasTouch) {
                this.slider.bind('touchstart', function (event) {
                    if (self.touchstart) return false;
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    self.touchstart = true;
                    self.isScrolling = undefined;
                    self.slider.mouseY = event.pageY;
                    self.slider.mouseX = event.pageX;
                });
                this.slider.bind('touchmove', function (event) {
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    if (self.touchstart) {
                        var pageX = (event.pageX || event.clientX);
                        var pageY = (event.pageY || event.clientY);

                        if (typeof self.isScrolling == 'undefined') {
                            self.isScrolling = !!( self.isScrolling || Math.abs(pageY - self.slider.mouseY) > Math.abs(pageX - self.slider.mouseX) )
                        }
                        if (self.isScrolling) {
                            self.touchstart = false;
                            return
                        } else {
                            self.mouseleft = pageX - self.slider.mouseX;
                            return false;
                        }
                    }
                    ;
                    return;
                });
                this.slider.bind('touchend', function (event) {
                    if (self.touchstart) {
                        self.touchstart = false;
                        if (self.mouseleft > self.options.touchSensitive) {
                            self.slidePrev();
                            self.mouseleft = 0;
                            return false;
                        } else if (self.mouseleft < -self.options.touchSensitive) {
                            self.slideNext();
                            self.mouseleft = 0;
                            return false;
                        }
                    }
                });
            } else {
                this.hoverDiv.hover(function () {
                    if (self.arrowButton) {
                        self.arrowButton.addClass('active');
                    }
                }, function () {
                    if (self.arrowButton) {
                        self.arrowButton.removeClass('active');
                    }
                });
                this.wrap.trigger("hover");
            }

            if (this.options.enableDrag) {
                this.slider.mousedown(function (event) {
                    if (!self.touchstart) {
                        self.touchstart = true;
                        self.isScrolling = undefined;
                        self.slider.mouseY = event.pageY;
                        self.slider.mouseX = event.pageX;
                    }
                    ;
                    return false;
                });
                this.slider.mousemove(function (event) {
                    if (self.touchstart) {
                        var pageX = (event.pageX || event.clientX);
                        var pageY = (event.pageY || event.clientY);

                        if (typeof self.isScrolling == 'undefined') {
                            self.isScrolling = !!( self.isScrolling || Math.abs(pageY - self.slider.mouseY) > Math.abs(pageX - self.slider.mouseX) )
                        }
                        if (this.isScrolling) {
                            self.touchstart = false;
                            return
                        } else {
                            self.mouseleft = pageX - self.slider.mouseX;
                            return false;
                        }
                    }
                    ;
                    return;
                });
                this.slider.mouseup(function (event) {
                    if (self.touchstart) {
                        self.touchstart = false;
                        if (self.mouseleft > self.options.touchSensitive) {
                            self.slidePrev();
                        } else if (self.mouseleft < -self.options.touchSensitive) {
                            self.slideNext();
                        }
                        self.mouseleft = 0;
                        return false;
                    }
                });
                this.slider.mouseleave(function (event) {
                    self.slider.mouseup();
                });
            }
            ;

        },

        resizeThumbDiv: function() {
            if (this.slideThumb) {
                this.slideThumb.unbind("touchstart");
                this.slideThumb.unbind("touchmove");
                this.slideThumb.unbind("touchmove");
                this.slideThumb.css("left", 0);
                var thumbsWidth = 0,
                    thumbDiv = this.slideThumb.parent().parent(),
                    self = this;

                $("a.md-thumb-item", this.slideThumb).each(function () {

                    if ($("img", $(this)).length > 0) {
                        if ($("img", $(this)).css("borderLeftWidth"))
                            thumbsWidth += parseInt($("img", $(this)).css("borderLeftWidth"), 10);
                        if ($("img", $(this)).css("borderRightWidth"))
                            thumbsWidth += parseInt($("img", $(this)).css("borderRightWidth"), 10);
                        if ($("img", $(this)).css("marginLeft"))
                            thumbsWidth += parseInt($("img", $(this)).css("marginLeft"), 10);
                        if ($("img", $(this)).css("marginRight"))
                            thumbsWidth += parseInt($("img", $(this)).css("marginRight"), 10);

                    }
                    else {
                        if ($("span", $(this)).css("borderLeftWidth"))
                            thumbsWidth += parseInt($("span", $(this)).css("borderLeftWidth"), 10);
                        if ($("span", $(this)).css("borderRightWidth"))
                            thumbsWidth += parseInt($("span", $(this)).css("borderRightWidth"), 10);
                        if ($("span", $(this)).css("marginLeft"))
                            thumbsWidth += parseInt($("span", $(this)).css("marginLeft"), 10);
                        if ($("span", $(this)).css("marginRight"))
                            thumbsWidth += parseInt($("span", $(this)).css("marginRight"), 10);
                    }

                    if ($(this).css("borderLeftWidth"))
                        thumbsWidth += parseInt($(this).css("borderLeftWidth"), 10);
                    if ($(this).css("borderRightWidth"))
                        thumbsWidth += parseInt($(this).css("borderRightWidth"), 10);
                    if ($(this).css("marginLeft"))
                        thumbsWidth += parseInt($(this).css("marginLeft"), 10);
                    if ($(this).css("marginRight"))
                        thumbsWidth += parseInt($(this).css("marginRight"), 10);

                    thumbsWidth += parseInt(self.slider.data("thumb-width"));
                });

                $(".md-thumb-next", thumbDiv).remove();
                $(".md-thumb-prev", thumbDiv).remove();
                if (thumbsWidth > $(".md-thumb-container", thumbDiv).width()) {
                    this.minThumbsLeft = $(".md-thumb-container", thumbDiv).width() - thumbsWidth;
                    this.slideThumb.width(thumbsWidth);
                    thumbDiv.append('<div class="md-thumb-prev"></div><div class="md-thumb-next"></div>');
                    $(".md-thumb-prev", thumbDiv).click(function () {
                        self.scollThumb("right");
                    });
                    $(".md-thumb-next", thumbDiv).click(function () {
                        self.scollThumb("left");
                    });

                    this.checkThumbArrow();
                    if (this.hasTouch) {
                        this.thumbsDrag = true;

                        var thumbTouch, thumbLeft;
                        this.slideThumb.bind('touchstart', function (event) {
                            event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            thumbTouch = true;
                            this.mouseX = event.pageX;
                            thumbLeft = self.slideThumb.position().left;
                            return false;
                        });
                        this.slideThumb.bind('touchmove', function (event) {
                            event.preventDefault();
                            event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            if (thumbTouch) {
                                self.slideThumb.css("left", thumbLeft + event.pageX - this.mouseX);
                            }
                            ;
                            return false;
                        });
                        this.slideThumb.bind('touchend', function (event) {
                            event.preventDefault();
                            event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            thumbTouch = false;
                            if (Math.abs(event.pageX - this.mouseX) < self.options.touchSensitive) {
                                var item = $(event.target).closest('a.md-thumb-item');
                                if (item.length) {
                                    self.slide(item.attr('rel'));
                                }
                                self.slideThumb.stop(true, true).animate({left: thumbLeft}, 400);
                                return false;
                            }
                            if (self.slideThumb.position().left < self.minThumbsLeft) {
                                self.slideThumb.stop(true, true).animate({left: self.minThumbsLeft}, 400, function () {
                                    self.checkThumbArrow()
                                });
                            } else if (self.slideThumb.position().left > 0) {
                                self.slideThumb.stop(true, true).animate({left: 0}, 400, function () {
                                    self.checkThumbArrow()
                                });
                            }
                            thumbLeft = 0;
                            return false;
                        });
                    }
                }
            }
        },

        scollThumb: function(position) {
            var self = this;
            if (this.slideThumb) {
                if (position == "left") {
                    var thumbLeft = this.slideThumb.position().left;
                    if (thumbLeft > this.minThumbsLeft) {
                        var containerWidth = $(".md-thumb-container", this.wrap).width();
                        if ((thumbLeft - containerWidth) > this.minThumbsLeft) {
                            this.slideThumb.stop(true, true).animate({left: thumbLeft - containerWidth}, 400, function () {
                                self.checkThumbArrow()
                            });
                        } else {
                            this.slideThumb.stop(true, true).animate({left: this.minThumbsLeft}, 400, function () {
                                self.checkThumbArrow()
                            });
                        }
                    }
                } else if (position == "right") {
                    var thumbLeft = this.slideThumb.position().left;
                    if (thumbLeft < 0) {
                        var containerWidth = $(".md-thumb-container", this.wrap).width();
                        if ((thumbLeft + containerWidth) < 0) {
                            this.slideThumb.stop(true, true).animate({left: thumbLeft + containerWidth}, 400, function () {
                                self.checkThumbArrow()
                            });
                        } else {
                            this.slideThumb.stop(true, true).animate({left: 0}, 400, function () {
                                self.checkThumbArrow()
                            });
                        }
                    }
                } else {
                    var thumbCurrent = $("a", this.slideThumb).index($("a.md-current", this.slideThumb));
                    if (thumbCurrent >= 0) {
                        var thumbLeft = this.slideThumb.position().left;
                        var currentLeft = thumbCurrent * $("a", this.slideThumb).width();
                        if (currentLeft + thumbLeft < 0) {
                            this.slideThumb.stop(true, true).animate({left: -currentLeft}, 400, function () {
                                self.checkThumbArrow()
                            });
                        } else {
                            var currentRight = currentLeft + $("a", this.slideThumb).width();
                            var containerWidth = $(".md-thumb-container", this.wrap).width();
                            if (currentRight + thumbLeft > containerWidth) {
                                this.slideThumb.stop(true, true).animate({left: containerWidth - currentRight}, 400, function () {
                                    self.checkThumbArrow()
                                });
                            }
                        }
                    }
                }
            }
        },

        checkThumbArrow: function() {
            var thumbLeft = this.slideThumb.position().left;
            if (thumbLeft > this.minThumbsLeft) {
                $(".md-thumb-next", this.wrap).show();
            } else {
                $(".md-thumb-next", this.wrap).hide();
            }
            if (thumbLeft < 0) {
                $(".md-thumb-prev", this.wrap).show();
            } else {
                $(".md-thumb-prev", this.wrap).hide();
            }
        },

        slide: function(index) {
            this.step = 0;
            this.slideShowDelay = this.slideItems[index].data("timeout") ? this.slideItems[index].data("timeout") : this.options.slideShowDelay;
            if (this.loadingBar) {
                var width = this.step * this.slideWidth / this.slideShowDelay;
                this.loadingBar.width(width);
                this.timerGlow.css({left: width - 100 + 'px'});
            }
            this.oIndex = this.activeIndex;
            this.activeIndex = parseInt(index);
            this.options.onStartTransition.call(this.slider);
            var execeptItemClass = '.slide-' + (this.activeIndex+1) + ', .slide-' + (this.oIndex+1);
            $('.md-slide-item:not(' + execeptItemClass +')', this.wrap).hide();
            
            if (this.slideItems[this.oIndex]) {
                $('div.md-bullet:eq(' + this.oIndex + ')', this.buttons).removeClass('md-current');
                $('a:eq(' + this.oIndex + ')', this.slideThumb).removeClass('md-current');
                this.removeTheCaptions(this.slideItems[this.oIndex]);
                var fx = this.options.transitions;
                
                //Generate random transition
                if (this.options.transitions.toLowerCase() == 'random') {
                    var transitions = new Array(
                        'slit-horizontal-left-top',
                        'slit-horizontal-top-right',
                        'slit-horizontal-bottom-up',
                        'slit-vertical-down',
                        'slit-vertical-up',
                        'strip-up-right',
                        'strip-up-left',
                        'strip-down-right',
                        'strip-down-left',
                        'strip-left-up',
                        'strip-left-down',
                        'strip-right-up',
                        'strip-right-down',
                        'strip-right-left-up',
                        'strip-right-left-down',
                        'strip-up-down-right',
                        'strip-up-down-left',
                        'left-curtain',
                        'right-curtain',
                        'top-curtain',
                        'bottom-curtain',
                        'slide-in-right',
                        'slide-in-left',
                        'slide-in-up',
                        'slide-in-down',
                        'fade');
                    fx = transitions[Math.floor(Math.random() * (transitions.length + 1))];
                    if (fx == undefined) fx = 'fade';
                    fx = $.trim(fx.toLowerCase());
                }

                //Run random transition from specified set (eg: effect:'strip-left-fade,right-curtain')
                if (this.options.transitions.indexOf(',') != -1) {
                    var transitions = this.options.transitions.split(',');
                    fx = transitions[Math.floor(Math.random() * (transitions.length))];
                    if (fx == undefined) fx = 'fade';
                    fx = $.trim(fx.toLowerCase());
                }

                //Custom transition as defined by "data-transition" attribute
                if (this.slideItems[this.activeIndex].data('transition')) {
                    var transitions = this.slideItems[this.activeIndex].data('transition').split(',');
                    fx = transitions[Math.floor(Math.random() * (transitions.length))];
                    fx = $.trim(fx.toLowerCase());
                }
                if (!(this.support = Modernizr.csstransitions && Modernizr.csstransforms3d) && (fx == 'slit-horizontal-left-top' || fx == 'slit-horizontal-top-right' || fx == 'slit-horizontal-bottom-up' || fx == 'slit-vertical-down' || fx == 'slit-vertical-up')) {
                    fx = 'fade';
                }
                this.lock = true;
                this.runTransition(fx);
                if (this.buttons)
                    $('div.md-bullet:eq(' + this.activeIndex + ')', this.buttons).addClass('md-current');
                if (this.slideThumb)
                    $('a:eq(' + this.activeIndex + ')', this.slideThumb).addClass('md-current');
                this.scollThumb();
                if(this.options.autoplayVideo){
                    $('.md-video', this.slideItems[this.activeIndex]).trigger('click');
                }
            } 
            else {
                this.slideItems[this.activeIndex].css({top: 0, left: 0}).show().find('video[autoplay]').load(); 
                if(this.options.autoplayVideo){
                    $('.md-video', this.slideItems[this.activeIndex]).trigger('click');
                }
                this.animateTheCaptions(this.slideItems[index]);
                if (this.buttons)
                    $('div.md-bullet:eq(' + this.activeIndex + ')', this.buttons).addClass('md-current');
                if (this.slideThumb)
                    $('a:eq(' + this.activeIndex + ')', this.slideThumb).addClass('md-current');
                this.scollThumb();
                this.lock = false;
            }
        },

        setTimer: function() {
            this.slide(0); 
            var mdslide = this;
            
            this.timer = setInterval(function(){
                if (mdslide.lock) return false;
                if (mdslide.play && !mdslide.pause) {
                    mdslide.step += 40;
                    if (mdslide.step > mdslide.slideShowDelay) {
                        mdslide.slideNext();
                    } else if (mdslide.loadingBar) {
                        var width = mdslide.step * mdslide.slideWidth / mdslide.slideShowDelay;
                        mdslide.loadingBar.width(width);
                        mdslide.timerGlow.css({left: width - 100 + 'px'});
                    }
                }
            }, 40);
        },

        slideNext: function() {
            if (this.lock) return false;
            var index = this.activeIndex;
            index++;
            if (index >= this.numItem && this.options.loop) {
                index = 0;
                this.slide(index);
            } else if (index < this.numItem) {
                this.slide(index);
            }
        },

        slidePrev: function() {
            if (this.lock) return false;
            var index = this.activeIndex;
            index--;
            if (index < 0 && this.options.loop) {
                index = this.numItem - 1;
                this.slide(index);
            }
            else if (index >= 0) {
                this.slide(index);
            }
        },

        endMoveCaption: function(caption) {
            var easeout = (caption.data("easeout")) ? caption.data("easeout") : "",
                ieVersion = (!!window.ActiveXObject && +(/msie\s(\d+)/i.exec(navigator.userAgent)[1])) || NaN;

            if (ieVersion != NaN)
                ieVersion = 11;
            else
                ieVersion = parseInt(ieVersion);

            clearTimeout(caption.data('timer-start'));
            if (easeout != "" && easeout != "keep" && ieVersion <= 9)
                caption.fadeOut();
            else {
                caption.removeClass(effectsIn.join(' '));
                if (easeout != "") {
                    if (easeout == "random")
                        easeout = effectsOut[Math.floor(Math.random() * e_out_length)];
                    caption.addClass(easeout);
                }
                else
                    caption.hide();
            }
        },

        removeTheCaptions: function(oItem) {
            oItem.find(".md-object").each(function () {
                var caption = $(this),
                    easeout = (caption.data("easeout")) ? caption.data("easeout") : "";
                if(easeout != 'keep'){
                    caption.stop(true, true).hide(); 
                }
                clearTimeout(caption.data('timer-start'));
                clearTimeout(caption.data('timer-stop'));
            });
        },

        animateTheCaptions: function(nextItem) {
            var self = this;
            $(".md-object", nextItem).each(function (boxIndex) {
                var caption = $(this);
                if (caption.data("easeout"))
                    caption.removeClass(effectsOut.join(' '));
                var easein = caption.data("easein") ? caption.data("easein") : "",
                    ieVersion = (!!window.ActiveXObject && +(/msie\s(\d+)/i.exec(navigator.userAgent)[1])) || NaN;

                if (ieVersion != NaN)
                    ieVersion = 11;
                else
                    ieVersion = parseInt(ieVersion);

                if (easein == "random")
                    easein = effectsIn[Math.floor(Math.random() * e_in_length)];

                caption.removeClass(effectsIn.join(' '));
                caption.hide();
                if (caption.data("start") != undefined) {
                    caption.data('timer-start', setTimeout(function () {
                        if (easein != "" && ieVersion <= 9)
                            caption.fadeIn();
                        else
                            caption.show().addClass(easein);
                    }, caption.data("start")));
                }
                else
                    caption.show().addClass(easein);

                if (caption.data("stop") != undefined) {
                    caption.data('timer-stop', setTimeout(function () {
                        self.endMoveCaption(caption);
                    }, caption.data('stop')));
                }
            });
        },

        //When Animation finishes
        transitionEnd: function() {
            this.options.onEndTransition.call(this.slider);
            $('.md-strips-container', this.slider).remove();
            this.slideItems[this.oIndex].hide();
            this.slideItems[this.activeIndex].show().find('video[autoplay]').load();
            this.lock = false;
            this.animateTheCaptions(this.slideItems[this.activeIndex]);
        },
        // remove loader
        removeLoader: function() {
            $('.wrap-loader-slider').addClass('fadeOut');
            $('.md-slide-items').css('min-height','');
        },
        
        // Add strips
        addStrips: function(vertical, opts) {
            var strip,
                opts = (opts) ? opts : options,
                stripsContainer = $('<div class="md-strips-container"></div>'),
                stripWidth = Math.round(this.slideWidth / opts.strips),
                stripHeight = Math.round(this.slideHeight / opts.strips),
                $image = $(".md-mainimg img", this.slideItems[this.activeIndex]),
                $overlay = $('.md-slider-overlay', this.slideItems[this.activeIndex]);
            if ($overlay.length) {
                var $temp = $('<div class="md-slider-overlay"></div>');
                $temp.css({
                    'background-color' : $overlay.css('background-color')
                });
                stripsContainer.append ($temp);
            }
            if ($image.length == 0)
                $image = $(".md-mainimg", this.slideItems[this.activeIndex]);
            for (var i = 0; i < opts.strips; i++) {
                var top = ((vertical) ? (stripHeight * i) + 'px' : '0px'),
                    left = ((vertical) ? '0px' : (stripWidth * i) + 'px'),
                    width, height;

                if (i == opts.strips - 1) {
                    width = ((vertical) ? '0px' : (this.slideWidth - (stripWidth * i)) + 'px'),
                        height = ((vertical) ? (this.slideHeight - (stripHeight * i)) + 'px' : '0px');
                } else {
                    width = ((vertical) ? '0px' : stripWidth + 'px'),
                        height = ((vertical) ? stripHeight + 'px' : '0px');
                }

                strip = $('<div class="mdslider-strip"></div>').css({
                    width: width,
                    height: height,
                    top: top,
                    left: left,
                    opacity: 0
                }).append($image.clone().css({
                    marginLeft: vertical ? 0 : -(i * stripWidth) + "px",
                    marginTop: vertical ? -(i * stripHeight) + "px" : 0
                }));
                stripsContainer.append(strip);
            }
            this.slider.append(stripsContainer);
        },

        // Add strips
        addTiles: function(x, y, index) {
            var tile;
            var stripsContainer = $('<div class="md-strips-container"></div>');
            var tileWidth = this.slideWidth / x,
                tileHeight = this.slideHeight / y,
                $image = $(".md-mainimg img", this.slideItems[index]),
                $overlay = $('.md-slider-overlay', this.slideItems[index]),
                specialHeight = 0,
                specialWidth = 0;
            if ($overlay.length) {
                var $temp = $('<div class="md-slider-overlay"></div>');
                $temp.css({
                    'background-color' : $overlay.css('background-color')
                });
                stripsContainer.append ($temp);
            }
            if ($image.length == 0)
                $image = $(".md-mainimg", this.slideItems[index]);
            
            // fix make round width height
            if(x > 1){
                var titleWidthRound = Math.round(tileWidth);
                specialWidth = titleWidthRound - tileWidth;
                tileWidth = titleWidthRound;
            }else if(y > 1){
                var titleHeightRound = Math.round(tileHeight);
                specialHeight = titleHeightRound - tileHeight;
                tileHeight = titleHeightRound;
            }

            for (var i = 0; i < y; i++) {
                for (var j = 0; j < x; j++) {
                    var top = (tileHeight * i) + 'px',
                        left = (tileWidth * j) + 'px';
                
                    // fix increase / decrease with/height in last col / last row
                    if(x > 1 && specialWidth && j === (x-1)){
                        var titleWidthNew = tileWidth - x * specialWidth;
                        left = (x-1)*tileWidth + 'px';
                        tileWidth = titleWidthNew;
                    }
                    else if(y > 1 && specialHeight && i == (y-1)){
                        var titleHeightNew = tileHeight - y * specialHeight;
                        top = (y-1)*tileHeight + 'px';
                        tileHeight = titleHeightNew;
                    }
                    
                    tile = $('<div class="mdslider-tile"/>').css({
                        width: tileWidth,
                        height: tileHeight,
                        top: top,
                        left: left
                    }).append($image.clone().css({
                        marginLeft: "-" + left,
                        marginTop: "-" + top
                    }));
                    stripsContainer.append(tile);
                }
            }

            this.slider.append(stripsContainer);
        },

        // Add strips
        addStrips2: function() {
            var strip,
                images = [],
                stripsContainer = $('<div class="md-strips-container"></div>'),
                $overlay = $('.md-slider-overlay', this.slideItems[this.activeIndex]);
            if ($overlay.length) {
                var $temp = $('<div class="md-slider-overlay"></div>');
                $temp.css({
                    'background-color' : $overlay.css('background-color')
                });
                stripsContainer.append ($temp);
            }
            
            // get all content of old slide to strip
            images.push(this.slideItems[this.oIndex].children());            
            // get content of next slide to strip
            if ($(".md-mainimg img", this.slideItems[this.activeIndex]).length > 0)
                images.push($(".md-mainimg img", this.slideItems[this.activeIndex]));
            else
                images.push($(".md-mainimg", this.slideItems[this.activeIndex]));

            for (var i = 0; i < 2; i++) {
                var cloneHtml = images[i].clone();
                if(i == 0){
                    $('.md-object', cloneHtml).removeClass(effectsIn.join(" "));
                }
                strip = $('<div class="mdslider-strip"></div>').css({
                    width: this.slideWidth,
                    height: this.slideHeight
                }).append(cloneHtml);
                stripsContainer.append(strip);
            }
            this.slider.append(stripsContainer);
        },

        // Add strips
        addSlits: function(fx) {
            var $stripsContainer = $('<div class="md-strips-container ' + fx + '"></div>'),
                $image = ($(".md-mainimg img", this.slideItems[this.oIndex]).length > 0) ? $(".md-mainimg img", this.slideItems[this.oIndex]) : $(".md-mainimg", this.slideItems[this.oIndex]),
                $div1 = $('<div class="mdslider-slit"/>').append($image.clone()),
                $div2 = $('<div class="mdslider-slit"/>'),
                position = $image.position(),
                $overlay = $('.md-slider-overlay', this.slideItems[this.activeIndex]);
            if ($overlay.length) {
                var $temp = $('<div class="md-slider-overlay"></div>');
                $temp.css({
                    'background-color' : $overlay.css('background-color')
                });
                $stripsContainer.append ($temp);
            }

            $div2.append($image.clone().css("top", position.top - (this.slideHeight / 2) + "px"));
            if (fx == "slit-vertical-down" || fx == "slit-vertical-up")
                $div2 = $('<div class="mdslider-slit"/>').append($image.clone().css("left", position.left - (this.slideWidth / 2) + "px"));

            $stripsContainer.append($div1).append($div2);
            this.slider.append($stripsContainer);
        },

        runTransition: function(fx) {
            var self = this;
            switch (fx) {
                case 'slit-horizontal-left-top':
                case 'slit-horizontal-top-right':
                case 'slit-horizontal-bottom-up':
                case 'slit-vertical-down':
                case 'slit-vertical-up':
                    this.addSlits(fx);
                    $(".md-object", this.slideItems[this.activeIndex]).hide();
                    this.slideItems[this.oIndex].hide();
                    this.slideItems[this.activeIndex].show();
                    var slice1 = $('.mdslider-slit', this.slider).first(),
                        slice2 = $('.mdslider-slit', this.slider).last();
                    var transitionProp = {
                        'transition': 'all ' + this.options.transitionsSpeed + 'ms ease-in-out',
                        '-webkit-transition': 'all ' + this.options.transitionsSpeed + 'ms ease-in-out',
                        '-moz-transition': 'all ' + this.options.transitionsSpeed + 'ms ease-in-out',
                        '-ms-transition': 'all ' + this.options.transitionsSpeed + 'ms ease-in-out'
                    };
                    $('.mdslider-slit', this.slider).css(transitionProp);
                    setTimeout(function () {
                        slice1.addClass("md-trans-elems-1");
                        slice2.addClass("md-trans-elems-2");
                    }, 50);
                    setTimeout(function () {
                        self.options.onEndTransition.call(self.slider);
                        $('.md-strips-container', self.slider).remove();
                        self.lock = false;
                        self.animateTheCaptions(self.slideItems[self.activeIndex]);
                    }, self.options.transitionsSpeed);
                    break;
                case 'strip-up-right':
                case 'strip-up-left':
                    this.addTiles(this.options.stripCols, 1, this.activeIndex);
                    var strips = $('.mdslider-tile', this.slider),
                        timeStep = this.options.transitionsSpeed / this.options.stripCols / 2,
                        speed = this.options.transitionsSpeed / 2;
                    if (fx == 'strip-up-right') strips = $('.mdslider-tile', this.slider).reverse();
                    strips.css({
                        height: '1px',
                        bottom: '0px',
                        top: "auto"
                    });
                    strips.each(function (i) {
                        var strip = $(this);
                        setTimeout(function () {
                            strip.animate({
                                height: '100%',
                                opacity: '1.0'
                            }, speed, 'easeInOutQuart', function () {
                                if (i == self.options.stripCols - 1) self.transitionEnd();
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-down-right':
                case 'strip-down-left':
                    this.addTiles(this.options.stripCols, 1, this.activeIndex);
                    var strips = $('.mdslider-tile', this.slider),
                        timeStep = this.options.transitionsSpeed / this.options.stripCols / 2,
                        speed = this.options.transitionsSpeed / 2;
                    if (fx == 'strip-down-right') strips = $('.mdslider-tile', this.slider).reverse();
                    strips.css({
                        height: '1px',
                        top: '0px',
                        bottom: "auto"
                    });
                    strips.each(function (i) {
                        var strip = $(this);
                        setTimeout(function () {
                            strip.animate({
                                height: '100%',
                                opacity: '1.0'
                            }, speed, 'easeInOutQuart', function () {
                                if (i == self.options.stripCols - 1) self.transitionEnd();
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-left-up':
                case 'strip-left-down':
                    this.addTiles(1, this.options.stripRows, this.activeIndex);
                    var strips = $('.mdslider-tile', this.slider),
                        timeStep = this.options.transitionsSpeed / this.options.stripRows / 2,
                        speed = this.options.transitionsSpeed / 2;
                    if (fx == 'strip-left-up') strips = $('.mdslider-tile', this.slider).reverse();
                    strips.css({
                        width: '1px',
                        left: '0px',
                        right: "auto"
                    });
                    strips.each(function (i) {
                        var strip = $(this);
                        setTimeout(function () {
                            strip.animate({
                                width: '100%',
                                opacity: '1.0'
                            }, speed, 'easeInOutQuart', function () {
                                if (i == self.options.stripRows - 1) self.transitionEnd();
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-right-up':
                case 'strip-right-down':
                    this.addTiles(1, this.options.stripRows, this.activeIndex);
                    var strips = $('.mdslider-tile', this.slider),
                        timeStep = this.options.transitionsSpeed / this.options.stripRows / 2,
                        speed = this.options.transitionsSpeed / 2;
                    if (fx == 'strip-left-right-up') strips = $('.mdslider-tile', this.slider).reverse();
                    strips.css({
                        width: '1px',
                        left: 'auto',
                        right: "1px"
                    });
                    strips.each(function (i) {
                        var strip = $(this);
                        setTimeout(function () {
                            strip.animate({
                                width: '100%',
                                opacity: '1.0'
                            }, speed, 'easeInOutQuart', function () {
                                if (i == self.options.stripRows - 1) self.transitionEnd();
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-right-left-up':
                case 'strip-right-left-down':
                    this.addTiles(1, this.options.stripRows, this.oIndex);
                    this.slideItems[this.oIndex].hide();
                    this.slideItems[this.activeIndex].show();
                    var strips = $('.mdslider-tile', this.slider),
                        timeStep = this.options.transitionsSpeed / this.options.stripRows,
                        speed = this.options.transitionsSpeed / 2;
                    if (fx == 'strip-right-left-up') strips = $('.mdslider-tile', this.slider).reverse();
                    strips.filter(':odd').css({
                        width: '100%',
                        right: '0px',
                        left: "auto",
                        opacity: 1
                    }).end().filter(':even').css({
                        width: '100%',
                        right: 'auto',
                        left: "0px",
                        opacity: 1
                    });
                    ;
                    strips.each(function (i) {
                        var strip = $(this);
                        var css = (i % 2 == 0) ? {
                            left: '-50%',
                            opacity: '0'
                        } : {right: '-50%', opacity: '0'};
                        setTimeout(function () {
                            strip.animate(css, speed, 'easeOutQuint', function () {
                                if (i == self.options.stripRows - 1) {
                                    self.options.onEndTransition.call(self.slider);
                                    $('.md-strips-container', self.slider).remove();
                                    self.lock = false;
                                    self.animateTheCaptions(self.slideItems[self.activeIndex]);
                                }
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-up-down-right':
                case 'strip-up-down-left':
                    this.addTiles(this.options.stripCols, 1, this.oIndex);
                    this.slideItems[this.oIndex].hide();
                    this.slideItems[this.activeIndex].show();
                    var strips = $('.mdslider-tile', this.slider),
                        timeStep = this.options.transitionsSpeed / this.options.stripCols / 2,
                        speed = this.options.transitionsSpeed / 2;
                    if (fx == 'strip-up-down-right') strips = $('.mdslider-tile', this.slider).reverse();
                    strips.filter(':odd').css({
                        height: '100%',
                        bottom: '0px',
                        top: "auto",
                        opacity: 1
                    }).end().filter(':even').css({
                        height: '100%',
                        bottom: 'auto',
                        top: "0px",
                        opacity: 1
                    });
                    ;
                    strips.each(function (i) {
                        var strip = $(this);
                        var css = (i % 2 == 0) ? {
                            top: '-50%',
                            opacity: 0
                        } : {bottom: '-50%', opacity: 0};
                        setTimeout(function () {
                            strip.animate(css, speed, 'easeOutQuint', function () {
                                if (i == self.options.stripCols - 1) {
                                    self.options.onEndTransition.call(self.slider);
                                    $('.md-strips-container', self.slider).remove();
                                    self.lock = false;
                                    self.animateTheCaptions(self.slideItems[self.activeIndex]);
                                }
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'left-curtain':
                    this.addTiles(this.options.stripCols, 1, this.activeIndex);
                    var strips = $('.mdslider-tile', this.slider),
                        stripItemWidth = this.getWidthStripItem(),
                        _self = this,
                        timeStep = this.options.transitionsSpeed / this.options.stripCols / 2;
                    strips.each(function (i) {
                        var strip = $(this);
                        var width = (i == _self.options.stripCols - 1) ? stripItemWidth.last : stripItemWidth.normal,
                            left = (i == _self.options.stripCols - 1) ? (_self.width - stripItemWidth.last) : (width * i);
                        strip.css({left: left, width: 0, opacity: 0});
                        setTimeout(function () {
                            strip.animate({
                                width: width,
                                opacity: '1.0'
                            }, self.options.transitionsSpeed / 2, function () {
                                if (i == self.options.stripCols - 1) self.transitionEnd();
                            });
                        }, timeStep * i);
                    });
                    break;
                case 'right-curtain':
                    this.addTiles(this.options.stripCols, 1, this.activeIndex);
                    var strips = $('.mdslider-tile', this.slider).reverse(),
                        stripItemWidth = this.getWidthStripItem(),
                        _self = this,
                        timeStep = this.options.transitionsSpeed / this.options.stripCols / 2;
                    //right-curtain neu de item cuoi cung co width la last thi js transition se chuyen cai last nay thanh first va gay loi
                    //vay nen ta lam nguoc lai, cho item first chua width last
                    strips.each(function (i) {
                        var strip = $(this);
                        var width = (i == 0) ? stripItemWidth.last : stripItemWidth.normal,
                            right = i ? ((width * (i -1)) + stripItemWidth.last) : 0;
                        strip.css({
                            right: right,
                            left: "auto",
                            width: 0,
                            opacity: 0
                        });
                        setTimeout(function () {
                            strip.animate({
                                width: width,
                                opacity: '1.0'
                            }, self.options.transitionsSpeed / 2, function () {
                                if (i == self.options.stripCols - 1) self.transitionEnd();
                            });
                        }, timeStep * i);
                    });
                    break;
                case 'top-curtain':
                    this.addTiles(1, this.options.stripRows, this.activeIndex);
                    var strips = $('.mdslider-tile', this.slider),
                        stripItemHeight = this.getHeightStripItem(),
                        _self = this,
                        timeStep = this.options.transitionsSpeed / this.options.stripRows / 2;
                    strips.each(function (i) {
                        var strip = $(this);
                        var height = (i == _self.options.stripRows - 1) ? stripItemHeight.last : stripItemHeight.normal,
                            top = (i == _self.options.stripRows - 1) ? (_self.height - stripItemHeight.last) : (height * i);
                        strip.css({top: top, height: 0, opacity: 0});
                        setTimeout(function () {
                            strip.animate({
                                height: height,
                                opacity: '1.0'
                            }, self.options.transitionsSpeed / 2, function () {
                                if (i == self.options.stripRows - 1) self.transitionEnd();
                            });
                        }, timeStep * i);
                    });
                    break;
                case 'bottom-curtain':
                    this.addTiles(1, this.options.stripRows, this.activeIndex);
                    var strips = $('.mdslider-tile', this.slider).reverse(),
                        stripItemHeight = this.getHeightStripItem(),
                        _self = this,
                        timeStep = this.options.transitionsSpeed / this.options.stripRows / 2;
                    //bottom-curtain neu de item cuoi cung co height la last thi js transition se chuyen cai last nay thanh first va gay loi
                    //vay nen ta lam nguoc lai, cho item first chua height last
                    strips.each(function (i) {
                        var strip = $(this);
                        var height = (i == 0) ? stripItemHeight.last : stripItemHeight.normal,
                            bottom = i ? ((height * (i -1)) + stripItemHeight.last) : 0;
                        strip.css({bottom: bottom, height: 0, opacity: 0});
                        setTimeout(function () {
                            strip.animate({
                                height: height,
                                opacity: '1.0'
                            }, self.options.transitionsSpeed / 2, function () {
                                if (i == self.options.stripRows - 1) self.transitionEnd();
                            });
                        }, timeStep * i);
                    });
                    break;
                case 'slide-in-right':
                    var i = 0;
                    this.addStrips2();
                    var strips = $('.mdslider-strip', this.slider);
                    strips.each(function () {
                        strip = $(this);
                        var left = i * self.slideWidth;
                        strip.css({
                            left: left
                        });
                        strip.animate({
                            left: left - self.slideWidth
                        }, self.options.transitionsSpeed, function () {
                            self.transitionEnd();
                        });
                        i++;
                    });
                    break;
                case 'slide-in-left':
                    var i = 0;
                    this.addStrips2();
                    var strips = $('.mdslider-strip', this.slider);
                    strips.each(function () {
                        strip = $(this);
                        var left = -i * self.slideWidth;
                        strip.css({
                            left: left
                        });
                        strip.animate({
                            left: self.slideWidth + left
                        }, (self.options.transitionsSpeed * 2), function () {
                            self.transitionEnd();
                        });
                        i++;
                    });
                    break;
                case 'slide-in-up':
                    var i = 0;
                    this.addStrips2();
                    var strips = $('.mdslider-strip', this.slider);
                    strips.each(function () {
                        strip = $(this);
                        var top = i * self.slideHeight;
                        strip.css({
                            top: top
                        });
                        strip.animate({
                            top: top - self.slideHeight
                        }, self.options.transitionsSpeed, function () {
                            self.transitionEnd();
                        });
                        i++;
                    });
                    break;
                case 'slide-in-down':
                    var i = 0;
                    this.addStrips2();
                    var strips = $('.mdslider-strip', this.slider);
                    strips.each(function () {
                        strip = $(this);
                        var top = -i * self.slideHeight;
                        strip.css({
                            top: top
                        });
                        strip.animate({
                            top: self.slideHeight + top
                        }, self.options.transitionsSpeed, function () {
                            self.transitionEnd();
                        });
                        i++;
                    });
                    break;
                case 'fade':
                default:
                    var opts = {
                        strips: 1
                    };
                    this.addStrips(false, opts);
                    var strip = $('.mdslider-strip:first', this.slider);
                    strip.css({
                        'height': '100%',
                        'width': this.slideWidth
                    });
                    if (fx == 'slide-in-right') strip.css({
                        'height': '100%',
                        'width': this.slideWidth,
                        'left': this.slideWidth + 'px',
                        'right': ''
                    });
                    else if (fx == 'slide-in-left') strip.css({
                        'left': '-' + this.slideWidth + 'px'
                    });

                    strip.animate({
                        left: '0px',
                        opacity: 1
                    }, this.options.transitionsSpeed, function () {
                        self.transitionEnd();
                    });
                    break;
            }
        },
        
        getWidthStripItem: function(){
            var width = this.slideWidth / this.options.stripCols,
                result = {};
            result.normal = Math.round(width);
            result.last = this.slideWidth - (result.normal * (this.options.stripCols - 1));
            return result;
        },
        getHeightStripItem: function(){
            var height = this.slideHeight / this.options.stripRows,
                result = {};
            result.normal = Math.round(height);
            result.last = this.slideHeight - (result.normal * (this.options.stripRows - 1));
            return result;
        },

        // Shuffle an array
        shuffle: function(oldArray) {
            var newArray = oldArray.slice();
            var len = newArray.length;
            var i = len;
            while (i--) {
                var p = parseInt(Math.random() * len);
                var t = newArray[i];
                newArray[i] = newArray[p];
                newArray[p] = t;
            }
            return newArray;
        },

        documentHasTouch: function() {
            return ('onthis.touchstart' in window || 'createTouch' in document);
        },

        resizeWindow: function() {
            this.wrap.width();
            this.slideWidth = this.options.responsive ? this.wrap.width() : this.options.width;
            if (this.options.responsive) {
                if (this.options.fullwidth && this.slideWidth > this.options.width)
                    this.slideHeight = this.options.height;
                else
                    this.slideHeight = Math.round(this.slideWidth / this.options.width * this.options.height);
            }

            if (!this.options.responsive && !this.options.fullwidth)
                this.wrap.width(this.slideWidth);
            if (!this.options.responsive && this.options.fullwidth)
                this.wrap.css({"min-width": this.slideWidth + "px"});
            if (this.options.fullwidth) {
                $(".md-objects", this.slider).width(this.options.width);
                var bulletSpace = 20;
                if ((this.wrap.width() - this.options.width) / 2 > 20)
                    bulletSpace = (this.wrap.width() - this.options.width) / 2;
                this.wrap.find(".md-bullets").css({
                    'left': bulletSpace,
                    'right': bulletSpace
                });
                this.wrap.find(".md-thumb").css({
                    'left': bulletSpace,
                    'right': bulletSpace
                });
            }
            if (this.options.responsive && this.options.fullwidth && (this.wrap.width() < this.options.width))
                $(".md-objects", this.slider).width(this.slideWidth);
            this.wrap.height(this.slideHeight);
            $(".md-slide-item", this.slider).height(this.slideHeight);

            this.resizeBackgroundImage();
            this.resizeThumbDiv();
            this.resizeFontSize();
            this.resizePadding();
            this.setThumnail()
        },

        resizeBackgroundImage: function() {
            var self = this;
            $(".md-slide-item", this.slider).each(function () {
                var $background = $(".md-mainimg img", this);

                if ($background.length == 1) {
                    if ($background.data("defW") && $background.data("defH")) {
                        var width = $background.data("defW"),
                            height = $background.data("defH");
                        self.changeImagePosition($background, width, height);
                    }
                }
                else
                    $(".md-mainimg", $(this)).width($(".md-slide-item:visible", self.slider).width()).height($(".md-slide-item:visible", self.slider).height())
            });
        },

        preloadImages: function() {
            var count = $(".md-slide-item .md-mainimg img", this.slider).length,
                self = this;
            this.slider.data('count', count);
            if (this.slider.data('count') == 0)
                this.slideReady();            
            $(".md-slide-item .md-mainimg img", this.slider).each(function () {
                $(this).load(function () {
                    var $image = $(this);
                    if (!$image.data('defW')) {
                        var dimensions = self.getImgSize($image.attr("src"));
                        self.changeImagePosition($image, dimensions.width, dimensions.height);
                        $image.data({
                            'defW': dimensions.width,
                            'defH': dimensions.height
                        });
                    }
                    self.slider.data('count', self.slider.data('count') - 1);
                    if (self.slider.data('count') == 0)
                        self.slideReady();
                });
                if (this.complete) $(this).load();
            });
        },

        slideReady: function() {
            this.slider.removeClass("loading-image");
            this.setTimer();
        },

        changeImagePosition: function($background, width, height) {
            var panelWidth = $(".md-slide-item:visible", this.slider).width(),
                panelHeight = $(".md-slide-item:visible", this.slider).height();

            if (height > 0 && panelHeight > 0) {
                if (((width / height) > (panelWidth / panelHeight))) {
                    var left = panelWidth - (panelHeight / height) * width;
                    $background.css({
                        width: "auto",
                        height: panelHeight + "px"
                    });
                    if (left < 0) {
                        $background.css({left: (left / 2) + "px", top: 0});
                    } else {
                        $background.css({left: 0, top: 0});
                    }
                } else {
                    var top = panelHeight - (panelWidth / width) * height;
                    $background.css({width: panelWidth + "px", height: "auto"});
                    if (top < 0) {
                        $background.css({top: (top / 2) + "px", left: 0});
                    } else {
                        $background.css({left: 0, top: 0});
                    }
                }
            }
        },

        resizeFontSize: function() {
            var fontDiff = 1,
                jqueryVer = $.fn.jquery.split('.');
            if (jqueryVer[0] == '1' && parseInt($.browser.version, 10) < 9)
                fontDiff = 6;
            if (this.wrap.width() < this.options.width) {
                $(".md-objects", this.slider).css({'font-size': this.wrap.width() / this.options.width * 100 - fontDiff + '%'});
            } else {
                $(".md-objects", this.slider).css({'font-size': 100 - fontDiff + '%'});
            }
        },

        resizePadding: function() {
            var self = this;
            if (this.wrap.width() < this.options.width && this.options.responsive) {
                $(".md-objects div.md-object", this.slider).each(function () {
                    var objectRatio = self.wrap.width() / self.options.width,
                        $_object = $(this),
                        objectPadding = {};

                    if ($_object.data('paddingtop'))
                        objectPadding['padding-top'] = $_object.data('paddingtop') * objectRatio;
                    if ($_object.data('paddingright'))
                        objectPadding['padding-right'] = $_object.data('paddingright') * objectRatio;
                    if ($_object.data('paddingbottom'))
                        objectPadding['padding-bottom'] = $_object.data('paddingbottom') * objectRatio;
                    if ($_object.data('paddingleft'))
                        objectPadding['padding-left'] = $_object.data('paddingleft') * objectRatio;

                    if ($('> a', $_object).length){
                        $('> a', $_object).css(objectPadding);
                    }
                    else
                        $_object.css(objectPadding);
                })
            }
            else {
                $(".md-objects div.md-object", this.slider).each(function () {
                    var $_object = $(this),
                        objectPadding = {};

                    if ($_object.data('paddingtop'))
                        objectPadding['padding-top'] = $_object.data('paddingtop');
                    if ($_object.data('paddingtop'))
                        objectPadding['padding-top'] = $_object.data('paddingtop');
                    if ($_object.data('paddingright'))
                        objectPadding['padding-right'] = $_object.data('paddingright');
                    if ($_object.data('paddingbottom'))
                        objectPadding['padding-bottom'] = $_object.data('paddingbottom');
                    if ($_object.data('paddingleft')) objectPadding['padding-left'] = $_object.data('paddingleft');

                    if ($('> a', $_object).length)
                        $('> a', $_object).css(objectPadding);
                    else
                        $_object.css(objectPadding);
                });
            }
        },

        setThumnail: function() {
            if (this.options.showThumb && !this.options.showBullet) {
                var thumbHeight = this.slider.data('thumb-height');

                if (this.options.posThumb == '1') {
                    var thumbBottom = thumbHeight / 2;
                    this.wrap.find(".md-thumb").css({
                        'height': thumbHeight + 20,
                        'bottom': -thumbBottom - 10
                    });
                    this.wrap.css({'margin-bottom': thumbBottom + 10})
                }
                else {
                    this.wrap.find(".md-thumb").css({
                        'height': thumbHeight + 20,
                        'bottom': -(thumbHeight + 20)
                    });
                    this.wrap.css({'margin-bottom': thumbHeight + 50})
                }
            }
        },

        getImgSize: function(imgSrc) {
            var newImg = new Image();
            newImg.src = imgSrc;
            var dimensions = {height: newImg.height, width: newImg.width};
            return dimensions;
        }
    };
    
    $.fn.mdSlider = function (options) {
        return new MDSlider($(this), options);
    };
    $.fn.reverse = [].reverse;
    //Image Preloader Function
    var ImagePreload = function (p_aImages, p_pfnPercent, p_pfnFinished) {
        this.m_pfnPercent = p_pfnPercent;
        this.m_pfnFinished = p_pfnFinished;
        this.m_nLoaded = 0;
        this.m_nProcessed = 0;
        this.m_aImages = new Array;
        this.m_nICount = p_aImages.length;
        for (var i = 0; i < p_aImages.length; i++) this.Preload(p_aImages[i])
    };

    ImagePreload.prototype = {
        Preload: function (p_oImage) {
            var oImage = new Image;
            this.m_aImages.push(oImage);
            oImage.onload = ImagePreload.prototype.OnLoad;
            oImage.onerror = ImagePreload.prototype.OnError;
            oImage.onabort = ImagePreload.prototype.OnAbort;
            oImage.oImagePreload = this;
            oImage.bLoaded = false;
            oImage.source = p_oImage;
            oImage.src = p_oImage
        },
        OnComplete: function () {
            this.m_nProcessed++;
            if (this.m_nProcessed == this.m_nICount) this.m_pfnFinished();
            else this.m_pfnPercent(Math.round((this.m_nProcessed / this.m_nICount) * 10))
        },
        OnLoad: function () {
            this.bLoaded = true;
            this.oImagePreload.m_nLoaded++;
            this.oImagePreload.OnComplete()
        },
        OnError: function () {
            this.bError = true;
            this.oImagePreload.OnComplete()
        },
        OnAbort: function () {
            this.bAbort = true;
            this.oImagePreload.OnComplete()
        }
    }
    $.fn.mdvideobox = function (opt) {
        $(this).each(function () {
            function init() {
                if ($("#md-overlay").length == 0) {
                    var _overlay = $('<div id="md-overlay" class="md-overlay"></div>').hide().click(closeMe);
                    var _container = $('<div id="md-videocontainer" class="md-videocontainer"><div id="md-video-embed"></div><div class="md-description clearfix"><div class="md-caption"></div><a id="md-closebtn" class="md-closebtn" href="#"></a></div></div>');
                    _container.css({
                        'width': options.initialWidth + 'px',
                        'height': options.initialHeight + 'px',
                        'display': 'none'
                    });
                    $("#md-closebtn", _container).click(closeMe);
                    $("body").append(_overlay).append(_container);
                }
                overlay = $("#md-overlay");
                container = $("#md-videocontainer");
                videoembed = $("#md-video-embed", container);
                caption = $(".md-caption", container);
                element.click(activate);
            }

            function closeMe() {
                overlay.fadeTo("fast", 0, function () {
                    $(this).css('display', 'none')
                });
                videoembed.html('');
                container.hide();
                return false;
            }

            function activate() {
                options.click.call();
                overlay.css({'height': $(window).height() + 'px'});
                var top = ($(window).height() / 2) - (options.initialHeight / 2);
                var left = ($(window).width() / 2) - (options.initialWidth / 2);
                container.css({top: top, left: left}).show();
                videoembed.css({
                    'background': '#fff url(css/loading.gif) no-repeat center',
                    'height': options.contentsHeight,
                    'width': options.contentsWidth
                });
                overlay.css('display', 'block').fadeTo("fast", options.defaultOverLayFade);
                caption.html(title);
                videoembed.fadeIn("slow", function () {
                    insert();
                });
                return false;
            }

            function insert() {
                videoembed.css('background', '#fff');
                embed = '<iframe src="' + videoSrc + '" width="' + options.contentsWidth + '" height="' + options.contentsHeight + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
                videoembed.html(embed);
            }

            var options = $.extend({
                initialWidth: 640,
                initialHeight: 400,
                contentsWidth: 640,
                contentsHeight: 350,
                defaultOverLayFade: 0.8,
                click: function () {
                }
            }, opt);
            var overlay, container, caption, videoembed, embed;
            var element = $(this);
            var videoSrc = options.autoplayVideo ? (element.attr("href") + "?autoplay=1") : element.attr("href");
            var title = element.attr("title");
            //lets start it
            init();
        });
    }
})(jQuery);
