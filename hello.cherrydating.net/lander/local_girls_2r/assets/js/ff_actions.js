!(function (a) {
  a(document).ready(function () {
    a(".step").first().addClass("active"),
      a(".next").on("click", function (e) {
        var t, s;
        e.preventDefault(),
          (e = a(this)),
          (t = e.closest(".step")),
          (s = e.closest(".step").next()),
          t.addClass("hidden"),
          setTimeout(function () {
            a("li.active").removeClass("active").next().addClass("active"),
              t.removeClass("active"),
              s.addClass("active");
          }, 250);
      });
  });
})(jQuery);
