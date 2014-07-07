var ngSwipe = angular.module('ngSwipe', []);
ngSwipe.directive('swipeContainer', function() {
	return {
		restrict: "E",
		template: '<div class="swipe-preview-container"><div id="carousel"> <div class="swipe-preview-content" ng-transclude></div> </div></div>',
		transclude: true,
		replace: true,
		scope: {
			goNext: "=?",
			goPrev: "=?",
		},
		link: function($scope, $element) {
			
function Carousel(element)
    {
        var self = this;
        element = $(element);

        var container = $(".swipe-preview-content", element);
        var panes = container.children();

        var pane_width = 0;
        var pane_count = panes.length;

        var current_pane = 0;


        /**
         * initial
         */
        this.init = function() {
            setPaneDimensions();

            $(window).on("load resize orientationchange", function() {
                setPaneDimensions();
            });
        };


        /**
         * set the pane dimensions and scale the container
         */
        function setPaneDimensions() {
            pane_width = element.width();
            panes.each(function() {
                $(this).width(pane_width);
            });
            container.width(pane_width*pane_count);
        };


        /**
         * show pane by index
         */
        this.showPane = function(index, animate) {
            // between the bounds
            index = Math.max(0, Math.min(index, pane_count-1));
            current_pane = index;

            var offset = -((100/pane_count)*current_pane);
            setContainerOffset(offset, animate);
        };


        function setContainerOffset(percent, animate) {
            container.removeClass("animate");

            if(animate) {
                container.addClass("animate");
            }

            container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
        }

        this.next = function() {
        	if($scope.goNext)
        	{
        		$scope.goNext();
        	}
        	
        	return this.showPane(current_pane+1, true);
        };
        this.prev = function() {
        	if($scope.goPrev)
        	{
        		$scope.goPrev();
        	}
        	
        	return this.showPane(current_pane-1, true);
        };


        function handleHammer(ev) {
            // disable browser scrolling
            ev.gesture.preventDefault();

            switch(ev.type) {
                case 'dragright':
                case 'dragleft':
                    // stick to the finger
                    var pane_offset = -(100/pane_count)*current_pane;
                    var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

                    // slow down at the first and last pane
                    if((current_pane == 0 && ev.gesture.direction == "right") ||
                        (current_pane == pane_count-1 && ev.gesture.direction == "left")) {
                        drag_offset *= .4;
                    }

                    setContainerOffset(drag_offset + pane_offset);
                    break;

                case 'swipeleft':
                    self.next();
                    ev.gesture.stopDetect();
                    break;

                case 'swiperight':
                    self.prev();
                    ev.gesture.stopDetect();
                    break;

                case 'release':
                    // more then 50% moved, navigate
                    if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
                        if(ev.gesture.direction == 'right') {
                            self.prev();
                        } else {
                            self.next();
                        }
                    }
                    else {
                        self.showPane(current_pane, true);
                    }
                    break;
            }
        }

        new Hammer(element[0], { dragLockToAxis: true }).on("release dragleft dragright swipeleft swiperight", handleHammer);
    }

    var carousel = new Carousel($element);
    carousel.init();

    function SetSize() {
    	var width = $(window).width();
        var height = $(window).height();
        $element.width(width);
        $element.height(height);
    };

    $(window).resize(function(){
        SetSize();
    });
    SetSize();

	}
}
});
