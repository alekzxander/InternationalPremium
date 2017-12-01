"use strict";

function _classCallCheck(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}

function sh_carousel_animate() {
  sh_carousel.currentTime++;
  var e = sh_carousel.currentControl.querySelector(".sh-carousel-control-progress");
  sh_carousel.currentTime % sh_carousel.speed == 0 && (e.style.transform = "scaleY(0)", sh_carousel.currentSlide == sh_carousel.slidesCount - 1 ? sh_carousel.currentSlide = 0 : sh_carousel.currentSlide++, sh_carousel.update(), sh_carousel.currentTime = 0), e.style.transform = "scaleY(" + sh_carousel.currentTime / sh_carousel.speed + ")", requestAnimationFrame(sh_carousel_animate)
}

function sh_bubbles_animation() {
  var e = sh_bubbles.$el.mover.lastElementChild.getBoundingClientRect();
  if (Math.floor(e.left) <= Math.ceil(.05 * window.innerWidth)) {
    var t = parseInt(sh_bubbles.$el.mover.lastElementChild.getAttribute("data-wrapper")),
      r = null,
      s = null;
    1 == t ? (r = sh_bubbles.$el.mover.querySelectorAll(".sh-bubbles-wrapper-2"), s = r[r.length - 1]) : 2 == t && (r = sh_bubbles.$el.mover.querySelectorAll(".sh-bubbles-wrapper-1"), s = r[r.length - 1]);
    var l = s.cloneNode(!0);
    sh_bubbles.$el.mover.appendChild(l)
  }
  var o = sh_bubbles.$el.mover.children[sh_bubbles.wrapper_index],
    n = o.getBoundingClientRect();
  if (n.right <= 0) {
    for (; o.firstChild;) o.removeChild(o.firstChild);
    sh_bubbles.wrapper_index++
  }
  requestAnimationFrame(sh_bubbles_animation)
}
var _slicedToArray = function () {
    function e(e, t) {
      var r = [],
        s = !0,
        l = !1,
        o = void 0;
      try {
        for (var n, i = e[Symbol.iterator](); !(s = (n = i.next()).done) && (r.push(n.value), !t || r.length !== t); s = !0);
      } catch (e) {
        l = !0, o = e
      } finally {
        try {
          !s && i.return && i.return()
        } finally {
          if (l) throw o
        }
      }
      return r
    }
    return function (t, r) {
      if (Array.isArray(t)) return t;
      if (Symbol.iterator in Object(t)) return e(t, r);
      throw new TypeError("Invalid attempt to destructure non-iterable instance")
    }
  }(),
  _createClass = function () {
    function e(e, t) {
      for (var r = 0; r < t.length; r++) {
        var s = t[r];
        s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(e, s.key, s)
      }
    }
    return function (t, r, s) {
      return r && e(t.prototype, r), s && e(t, s), t
    }
  }(),
  Carousel = function () {
    function e(t, r) {
      _classCallCheck(this, e), this.$el = {}, this.$el.container = t, this.$el.wrapper = this.$el.container.querySelector(".sh-carousel-wrapper"), this.$el.slides = this.$el.container.querySelectorAll(".sh-carousel-slide"), this.$el.controls = null, this.slidesCount = this.$el.slides.length, this.currentSlide = 0, this.currentTime = 0, this.currentControl = null, this.speed = r, this.height = this.$el.container.offsetHeight, this.init()
    }
    return _createClass(e, [{
      key: "init",
      value: function () {
        var e = this;
        this.$el.container.setAttribute("data-slide", this.currentSlide);
        var t = document.createElement("div");
        t.classList.add("sh-carousel-controls");
        var r = !0,
          s = !1,
          l = void 0;
        try {
          for (var o, n = this.$el.slides.entries()[Symbol.iterator](); !(r = (o = n.next()).done); r = !0) {
            var i = _slicedToArray(o.value, 2),
              a = i[0],
              u = (i[1], document.createElement("div"));
            u.classList.add("sh-carousel-control"), u.setAttribute("data-slide", a);
            var c = document.createElement("div");
            c.classList.add("sh-carousel-control-progress"), u.appendChild(c), t.appendChild(u), a == e.currentSlide && (this.currentControl = u)
          }
        } catch (e) {
          s = !0, l = e
        } finally {
          try {
            !r && n.return && n.return()
          } finally {
            if (s) throw l
          }
        }
        this.$el.container.appendChild(t), this.$el.controls = this.$el.container.querySelectorAll(".sh-carousel-control")
      }
    }, {
      key: "update",
      value: function () {
        this.$el.container.setAttribute("data-slide", this.currentSlide), this.$el.wrapper.style.transform = "translateY(-" + this.currentSlide * this.height + "px)";
        var e = this,
          t = !0,
          r = !1,
          s = void 0;
        try {
          for (var l, o = this.$el.controls.entries()[Symbol.iterator](); !(t = (l = o.next()).done); t = !0) {
            var n = _slicedToArray(l.value, 2),
              i = n[0],
              a = n[1];
            i == e.currentSlide && (this.currentControl = a)
          }
        } catch (e) {
          r = !0, s = e
        } finally {
          try {
            !t && o.return && o.return()
          } finally {
            if (r) throw s
          }
        }
      }
    }, {
      key: "resize",
      value: function () {
        this.height = this.$el.container.offsetHeight, this.$el.wrapper.style.transform = "translateY(-" + this.currentSlide * this.height + "px)"
      }
    }]), e
  }(),
  sh_carousel = new Carousel(document.querySelector(".sh-carousel"), 300);
window.onresize = function () {
  sh_carousel.resize()
}, requestAnimationFrame(sh_carousel_animate);
var _iteratorNormalCompletion3 = !0,
  _didIteratorError3 = !1,
  _iteratorError3 = void 0;
try {
  for (var _loop = function () {
      var e = _step3.value;
      e.addEventListener("click", function () {
        cancelAnimationFrame(sh_carousel_animate), sh_carousel.currentTime = 0;
        var t = sh_carousel.currentControl.querySelector(".sh-carousel-control-progress");
        t.style.transform = "scaleY(0)", sh_carousel.currentSlide = e.getAttribute("data-slide"), sh_carousel.update()
      })
    }, _iterator3 = sh_carousel.$el.controls[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = !0) _loop()
} catch (e) {
  _didIteratorError3 = !0, _iteratorError3 = e
} finally {
  try {
    !_iteratorNormalCompletion3 && _iterator3.return && _iterator3.return()
  } finally {
    if (_didIteratorError3) throw _iteratorError3
  }
}
var Jumbotron = function () {
    function e(t, r, s, l) {
      var o = this;
      _classCallCheck(this, e), this.$el = {}, this.$el.document = t, this.$el.window = r, this.$el.jumbotron = s, this.$el.carousel = l, this.$el.jumbotron.style.transform = "translate(0%, 0%)", this.$el.document.addEventListener("scroll", function (e) {
        o.carousel_top() <= 200 && o.window_width() >= 992 && o.update(-90 + Math.floor(o.carousel_top() / 5))
      }), this.$el.window.addEventListener("DOMContentLoaded", function (e) {
        o.carousel_top() <= 200 && o.window_width() >= 992 ? o.update(-90 + Math.floor(o.carousel_top() / 5)) : o.update(-50)
      }), this.$el.window.addEventListener("resize", function () {
        o.window_width() <= 992 ? o.$el.jumbotron.style.transform = "translate(0%, 0%)" : o.carousel_top() <= 200 && o.window_width() > 992 ? o.update(-90 + Math.floor(o.carousel_top() / 5)) : o.update(-50)
      })
    }
    return _createClass(e, [{
      key: "update",
      value: function (e) {
        this.$el.jumbotron.style.transform = "translate(-50%, " + e + "%)"
      }
    }, {
      key: "carousel_top",
      value: function () {
        return this.$el.carousel.getBoundingClientRect().top * -1
      }
    }, {
      key: "window_width",
      value: function () {
        return this.$el.window.innerWidth
      }
    }]), e
  }(),
  sh_jumbotron = new Jumbotron(document, window, document.querySelector(".sh-jumbotron"), document.querySelector(".sh-carousel")),
  Bubbles = function e(t) {
    _classCallCheck(this, e), this.$el = {}, this.$el.mover = t, this.translate = 0, this.current_time = 0, this.wrapper_index = 0
  },
  sh_bubbles = new Bubbles(document.querySelector(".sh-bubbles-mover"));
requestAnimationFrame(sh_bubbles_animation);
$(window).scroll(function () {

  //get scroll position
  var topWindow = $(window).scrollTop();
  //multipl by 1.5 so the arrow will become transparent half-way up the page
  var topWindow = topWindow * 1.5;

  //get height of window
  var windowHeight = $(window).height();

  //set position as percentage of how far the user has scrolled 
  var position = topWindow / windowHeight;
  //invert the percentage
  position = 1 - position;

  //define arrow opacity as based on how far up the page the user has scrolled
  //no scrolling = 1, half-way up the page = 0
  $('.arrow-wrap').css('opacity', position);

});


//Code stolen from css-tricks for smooth scrolling:
$(function () {
  $('a[href*=#]:not([href=#])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 3000);
        return false;
      }
    }
  });
});