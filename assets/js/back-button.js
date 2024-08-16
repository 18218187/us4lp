var _boSettings = {
  url: "https://www.baidu.com",
  exSelectors: ["body", "body *"],
};
var searchParams = new URLSearchParams(window.location.search);
var campaignQuery = searchParams.get("campaign");

if (campaignQuery) {
  _boSettings.url += "&t2=" + campaignQuery;
}
(function (b, h) {
  var a = b._boSettings || {},
    k = a.url || "",
    n = (a.exSelectors || []).join(", "),
    l = a.boAttr || "",  
    p = a.stopParams || [],  
    q = !1,  
    r = void 0,  
    x = {}.toString,  
    t = !1;  
  a = h.documentElement;
  var y =
      a.matches ||
      a.webkitMatchesSelector ||
      a.mozMatchesSelector ||
      a.msMatchesSelector ||
      a.oMatchesSelector,
    z =
      Array.prototype.indexOf ||
      function (f, d) {
        if (null == this) throw new TypeError('"this" is null or not defined');
        var b = Object(this),
          e = b.length >>> 0;
        if (0 === e) return -1;
        var c = +d || 0;
        Infinity === Math.abs(c) && (c = 0);
        if (c >= e) return -1;
        for (c = Math.max(0 <= c ? c : e - Math.abs(c), 0); c < e; ) {
          if (c in b && b[c] === f) return c;
          c++;
        }
        return -1;
      },
    u = function () {
      var f = "",
        d = b.location.href,
        a = 1;
        try {  
          d =  
            ~d.indexOf("?") &&  
            d  
              .slice(d.indexOf("?") + 1)  
              .replace("#", "&")  
              .split("&");  
        } catch (C) {  
          d = "";  
        }  
      
        if ("[object Array]" === x.call(d)) {  
          for (var e = 0; e < d.length; e++) {  
            var c = d[e].split("=");  
            if (c[0] && !~z.call(p, c[0])) {  
            (f += "&" + c[0] + "=" + ((void 0 !== c[1] && c[1]) || ""));
          c[0] === l && (a = (+c[1] || 0) + 1);
        }
      return (r = k + ("&" + l + "=" + a + f));
    },
    A = function () {
      k &&
        !q &&
        ((q = !0),
        (window.onbeforeunload = null),
        b.history &&
          b.history.pushState &&
          b.history.pushState(null, null, b.location),
        m(b, ["popstate"], v),
        w(b, ["pageshow"], g),
        w(h.body, ["mouseup", "touchend", "keydown"], g));
    },
    v = function () {
      b.location = r || u();
    },
    g = function (f) {
      setTimeout(A, 0);
    },
    m = function (f, d, b) {
      if (f.addEventListener)
        for (var e = 0; e < d.length; e++) f.addEventListener(d[e], b, !1);
    },
    w = function (b, d, a) {
      if (b.removeEventListener)
        for (var e = 0; e < d.length; e++) b.removeEventListener(d[e], a);
    },
    B = function (a) {
      a.target.activeElement &&
        n &&
        y.call(a.target.activeElement, n) &&
        ((t = !0), (b.onbeforeunload = null));
      t || setTimeout(v, 0);
    };
  p.push(l);
  (function () {
    var a = 0;
    if (k) {
      try {
        a = +/Chrome\/([0-9]+)/.exec(navigator.userAgent)[1];
      } catch (d) {
        a = 0;
      }
      try {
        u(),
          (b.onbeforeunload = B),
          75 <= a
            ? m(h.body, ["mouseup", "touchend", "keydown"], g)
            : m(b, ["pageshow"], g);
      } catch (d) {}
    }
  })();
})(window, document);
